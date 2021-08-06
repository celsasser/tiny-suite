/**
 * @license MIT (see project's LICENSE file)
 */

import { SymbolTable } from '@tiny/core';

export enum Bearing {
	North = 'north',
	South = 'south',
	East = 'east',
	West = 'west',
	NorthEast = 'northEast',
	NorthWest = 'northWest',
	SouthEast = 'southEast',
	SouthWest = 'southWest',
}

export type NumberServer = () => number;
/**
 * I'm leaving room for symbols that point to symbols but not going as far
 * as supporting arrays. Our deep resolution functionality in `SymbolTable`
 * isn't that smart.
 */
export class TinySymbolTable extends SymbolTable<string | number> {}

export interface ISize {
	width: number;
	height: number;
}
