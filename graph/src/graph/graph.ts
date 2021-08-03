/**
 * @license MIT (see project's LICENSE file)
 */

import * as _ from 'lodash';
import { EdgeMap, VertexMap } from '../types';
import { Edge } from './edge';
import { Vertex } from './vertex';

export class Graph {
	private readonly _vertexMap: Readonly<VertexMap>;
	private readonly _edgeMap: EdgeMap = {};
	private readonly _connectionMap: { [vertexName: string]: Edge[] } = {};

	/***********************
	 * Public Interface
	 **********************/
	constructor(vertexMap: Readonly<VertexMap>, edges: ReadonlyArray<Edge>) {
		this._vertexMap = vertexMap;
		edges.forEach(this._addEdge.bind(this));
	}

	/**
	 * Gets the edge by `edgeName`
	 * @param edgeName
	 * @throws {Error} if not found
	 */
	public getEdge(edgeName: string): Edge {
		const edge = this._edgeMap[edgeName];
		if (edge) {
			return edge;
		} else {
			throw new Error(`edge "${edgeName}" not found`);
		}
	}

	/**
	 * Gets all edges pointing outward from the vertex.
	 * @param vertexName - vertex's name
	 */
	public getEdges(vertexName: string): Edge[] {
		// it is totally legitimate for a vertex to not have any outgoing edges
		return this._connectionMap[vertexName] || [];
	}

	public getVertex(vertexName: string): Vertex {
		const vertex = this._vertexMap[vertexName];
		if (vertex) {
			return vertex;
		} else {
			throw new Error(`vertex "${vertexName}" not found`);
		}
	}

	public isEmpty(): boolean {
		return _.isEmpty(this._edgeMap);
	}

	/***********************
	 * Public Interface
	 **********************/
	private _addEdge(edge: Edge): void {
		this._edgeMap[edge.name] = edge;
		if (this._connectionMap[edge.vertexFrom.name] === undefined) {
			this._connectionMap[edge.vertexFrom.name] = [];
		}
		this._connectionMap[edge.vertexFrom.name].push(edge);
	}
}
