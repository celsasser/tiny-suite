/**
 * @license MIT (see project's LICENSE file)
 */

import { Graph } from '../graph';
import { TinySymbolTable } from './primitives';

export interface IParsedInput {
	graph: Graph;
	project: IProjectProperties;
	symbols: TinySymbolTable;
}

export interface IProjectProperties {
	/**
	 * Name of starting vertex
	 */
	start: string;
	/**
	 * The maximum number of steps to be taken before forcibly ending
	 * graph traversal
	 */
	steps?: number;
}
