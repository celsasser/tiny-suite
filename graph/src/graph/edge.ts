/**
 * @license MIT (see project's LICENSE file)
 */

import { IWeighted, NumbersServer } from '../types';
import { Vertex } from './vertex';

/**
 * Describes a directed connection.
 */
export class Edge implements IWeighted {
	public readonly name: string;
	public readonly vertexFrom: Vertex;
	public readonly vertexTo: Vertex;
	public readonly weight: number;
	private readonly _panOffsetServer?: NumbersServer;
	private readonly _velocityOffsetServer?: NumbersServer;
	private _panOffsetState?: number[];
	private _velocityOffsetState?: number[];

	public constructor({
		name,
		panOffset,
		velocityOffset,
		vertexFrom,
		vertexTo,
		weight = 1,
	}: {
		name: string;
		panOffset?: NumbersServer;
		velocityOffset?: NumbersServer;
		vertexFrom: Vertex;
		vertexTo: Vertex;
		weight?: number;
	}) {
		this.name = name;
		this.vertexFrom = vertexFrom;
		this.vertexTo = vertexTo;
		this.weight = weight;
		this._panOffsetServer = panOffset;
		this._velocityOffsetServer = velocityOffset;
		this.generateNextState();
	}

	/***********************
	 * Public Accessors
	 **********************/
	public get panOffset(): number[] | undefined {
		return this._panOffsetState;
	}

	public get velocityOffset(): number[] | undefined {
		return this._velocityOffsetState;
	}

	/***********************
	 * Public Interface
	 **********************/
	/**
	 * Generates the next series of state variables. We generate the first round.
	 */
	public generateNextState(): void {
		if (this._panOffsetServer) {
			this._panOffsetState = this._panOffsetServer();
		}
		if (this._velocityOffsetServer) {
			this._velocityOffsetState = this._velocityOffsetServer();
		}
	}
}
