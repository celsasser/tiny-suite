/**
 * @license MIT (see project's LICENSE file)
 */

import { IState } from './state';

/***********************
 * Creating basic types
 **********************/
export enum Bearing {
	/**
	 * Top down
	 */
	South = 'south',
	/**
	 * From left to right
	 */
	East = 'east',
	/**
	 * up and left from the row heading
	 */
	NorthEast = 'northEast',
	/**
	 * down and left from the column heading
	 */
	SouthEast = 'southEast',
	/**
	 * down and right from the column heading
	 * - or
	 * right and down from the row heading
	 */
	SouthWest = 'southWest',
}

/***********************
 * Type definitions
 **********************/
export type ColumnBearingType = ReadonlyArray<Bearing>;
export type RowBearingType = ReadonlyArray<Bearing>;

/**
 * I want these to be either treated as an array treated as an enum with some
 * TS mechanism for dealing with it. But I cant find a way. I attempted
 * `export type ColumnBearings = [Bearing.South, Bearing.SouthEast, Bearing.SouthWest];`
 * but then the type is a combination of all of those values. I am going to simplify
 * and worry about it later or not at at all.
 */
export const ColumnBearingValues: ColumnBearingType = [
	Bearing.South,
	Bearing.SouthEast,
	Bearing.SouthWest,
];
export const RowBearingValues: RowBearingType = [
	Bearing.East,
	Bearing.NorthEast,
	Bearing.SouthEast,
];

/**
 * Our cell values will always be string values that will be evaluated as JS.
 */
export type FormulaType = string;
export type KeyboardShortcutType = string[][];
/**
 * This is how they are typed locally. The state will be included by us.
 * The rest of the args are defined by the function itself.
 */
export type NumbersServerType = (
	state: Readonly<IState>,
	...args: any
) => NumbersServerResultType;

export type NumbersServerResultType = number[];

/***********************
 * Interfaces
 **********************/
export interface ICoordinate {
	/**
	 * Column coordinate
	 */
	x: number;
	/**
	 * Row coordinate
	 */
	y: number;

	/**
	 * Render the coordinate using the conventional spreadsheet
	 * coordinate system: "$<A-Z><row+1>"
	 */
	toString(): string;
}

/**
 * An interface that should be implemented for anything that
 * wants to live in a context.
 */
export interface IHashable {
	readonly id: string;
}

export interface ISize {
	width: number;
	height: number;
}

/**
 * Interface including our suite of MIDI formula properties
 */
export interface IValueServer {
	noteFormula?: FormulaType;
	panFormula?: FormulaType;
	velocityFormula?: FormulaType;
}
