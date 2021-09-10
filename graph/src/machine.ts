/**
 * @license MIT (see project's LICENSE file)
 *
 * "machine" is really a little glorified for the simplicity of this
 * fella, but I wasn't coming up with anything I liked better
 */

import { appendArray, findChampionByInterface, IChannel, TinyDefault } from '@tiny/core';
import * as _ from 'lodash';
import { Edge, Vertex } from './graph';
import { Cardinality, IParsedInput } from './types';

interface ITransition {
	/**
	 * Edge leading to `vertex`. In all but processing the starting vertex
	 * there will be an "from" edge.
	 */
	edge?: Edge;
	vertex: Vertex;
}

/**
 * Processes parsed input and traverses the graph and generates a channel stream
 */
export class Machine {
	private readonly _input: Readonly<IParsedInput>;

	constructor(input: Readonly<IParsedInput>) {
		this._input = input;
	}

	/***********************
	 * Public Interface
	 **********************/
	public run(): IChannel[] {
		let steps = 0;
		const channels: IChannel[] = [];
		const vertex = this._input.graph.getVertex(this._input.project.start);
		// we process `_traverse` in a while loop to make sure we pick up
		// as many cycles as have been requested (if indeed the request was by steps).
		do {
			steps = this._traverse(channels, [{ vertex }], steps);
		} while (
			this._input.project.steps !== undefined &&
			steps < this._input.project.steps
		);
		channels.forEach(this._cleanChannel.bind(this));
		return channels;
	}

	/***********************
	 * Private Interface
	 **********************/
	private _cleanChannel(channel: IChannel): void {
		// remove note duplicates
		channel.notes = channel.notes.map((value: number | number[]): number[] => {
			return _.chain<number>(value as number[])
				.sort()
				.sortedUniq()
				.value();
		});
	}

	private _getTransitionsFromVertices(vertices: ReadonlyArray<Vertex>): ITransition[] {
		return vertices.reduce<ITransition[]>((accumulator, vertex) => {
			const edges = this._input.graph.getEdges(vertex.name);
			if (vertex.transition === Cardinality.Poly) {
				edges.forEach((edge) => {
					accumulator.push({ edge, vertex: edge.vertexTo });
				});
			} else {
				const edge = findChampionByInterface(edges);
				if (edge) {
					accumulator.push({ edge, vertex: edge.vertexTo });
				}
			}
			return accumulator;
		}, []);
	}

	/**
	 * Records the vertex's current state and generates the vertex's next step
	 * Note: merging pan and velocity is a little weird 'cause it's the vertex processed
	 * that wins the rumble. Of course this is only an issue where multiple vertices
	 * are processed during a single step.
	 * @private
	 */
	private _recordVertex(channel: IChannel, vertex: Vertex, step: number): void {
		if (channel.notes[step] === undefined) {
			channel.notes[step] = [];
		}
		if (vertex.notes) {
			// note: we will deal with duplicates during cleanup
			appendArray(channel.notes[step] as number[], vertex.notes);
		}
		if (vertex.velocity && vertex.velocity.length > 0) {
			if (channel.velocities === undefined) {
				channel.velocities = [];
			}
			// todo: we would like to be able to support more than a single velocity
			channel.velocities[step] = vertex.velocity[0];
		}
		if (vertex.pan && vertex.pan.length > 0) {
			if (channel.pan === undefined) {
				channel.pan = [];
			}
			channel.pan[step] = vertex.pan[0];
		}
		vertex.generateNextState();
	}

	/**
	 * Records the edge's current state and generates the edge's next step
	 * @private
	 */
	private _recordEdge(channel: IChannel, edge: Edge, step: number): void {
		if (edge.velocityOffset && edge.velocityOffset.length > 0) {
			if (channel.velocities === undefined) {
				channel.velocities = [];
			}
			if (channel.velocities[step] === undefined) {
				channel.velocities[step] = TinyDefault.Velocity;
			}
			// todo: we would like to be able to support more than a single velocity (same note as above)
			channel.velocities[step] += edge.velocityOffset[0];
		}
		if (edge.panOffset && edge.panOffset.length > 0) {
			if (channel.pan === undefined) {
				channel.pan = [];
			}
			if (channel.pan[step] === undefined) {
				channel.pan[step] = TinyDefault.Pan;
			}
			// todo: we should either change this to be a non-scalar or plan support
			//  for multiple pan values which will lead our horse to the channel division well.
			channel.pan[step] += edge.panOffset[0];
		}
		edge.generateNextState();
	}

	/**
	 * Traverses recursively through sets of transitions
	 * @param result - both input and output (mutable)
	 * @param transitions - transitions to be processed during this invocation
	 * @param step - what step index is this?
	 * @returns {number} step index
	 * @private
	 */
	private _traverse(
		result: IChannel[],
		transitions: ReadonlyArray<ITransition>,
		step = 0
	): number {
		if (
			transitions.length > 0 &&
			step < (this._input.project.steps ?? Number.MAX_SAFE_INTEGER)
		) {
			/**
			 * Record this set of transitions
			 */
			transitions.forEach(({ edge, vertex }) => {
				if (result[vertex.channel] === undefined) {
					result[vertex.channel] = {
						notes: [],
					};
				}
				this._recordVertex(result[vertex.channel], vertex, step);
				if (edge) {
					this._recordEdge(result[vertex.channel], edge, step);
				}
			});
			/**
			 * Now we step forward and recursively process our new set of transitions
			 */
			step = this._traverse(
				result,
				this._getTransitionsFromVertices(transitions.map((t) => t.vertex)),
				step + 1
			);
		}
		return step;
	}
}
