/**
 * @license MIT (see project's LICENSE file)
 */

import { Cardinality, NumbersServer } from '../types';

/**
 * Describes what I sometimes also call a collection. It halds a set of metadata
 * that serves as the default when this vertex is moved to. We allow edges
 * to either override them or modify them when creating sequences (the values
 * within are considered to be immutable)
 */
export class Vertex {
	public readonly channel: number;
	public readonly name: string;
	/**
	 * Whether we follow one edge or all edges (assuming this is more than one)
	 */
	public readonly transition: Cardinality;
	private readonly _notesServer: NumbersServer;
	private readonly _panServer?: NumbersServer;
	private readonly _velocityServer?: NumbersServer;
	private readonly _weightsServer?: NumbersServer;
	/**
	 * Current set of note[s] queued up for the harvest
	 */
	private _notesState!: number[];
	private _panState?: number[];
	private _velocityState?: number[];

	/**
	 * Constructor
	 * @param channel - optionally specified MIDI channel
	 * @param name - name he goes by in the specification
	 * @param notes - we do not force a server to be included in the spec. The
	 * 	absence of a `notes` specification implies that this guy is a melodic rest.
	 * @param pan
	 * @param transition - how edges should be traversed from this vertex
	 * @param velocity
	 * @param weights
	 */
	public constructor({
		channel = 0,
		name,
		notes = () => [],
		pan,
		transition = Cardinality.Mono,
		velocity,
	}: {
		channel?: number;
		name: string;
		notes?: NumbersServer;
		pan?: NumbersServer;
		transition?: Cardinality;
		velocity?: NumbersServer;
	}) {
		this._notesServer = notes;
		this._panServer = pan;
		this._velocityServer = velocity;
		this.channel = channel;
		this.name = name;
		this.transition = transition;
		this.generateNextState();
	}

	/***********************
	 * Public Accessors
	 **********************/
	public get notes(): number[] | undefined {
		return this._notesState;
	}
	public get pan(): number[] | undefined {
		return this._panState;
	}
	public get velocity(): number[] | undefined {
		return this._velocityState;
	}

	/***********************
	 * Public Interface
	 **********************/
	/**
	 * Generates the next series of state variables. We generate the first round.
	 */
	public generateNextState(): void {
		this._notesState = this._notesServer();
		if (this._panServer) {
			this._panState = this._panServer();
		}
		if (this._velocityServer) {
			this._velocityState = this._velocityServer();
		}
	}
}
