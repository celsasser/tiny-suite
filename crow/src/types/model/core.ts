/**
 * @license MIT (see project's LICENSE file)
 */

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

export type ColumnBearing = Bearing.South | Bearing.SouthEast | Bearing.SouthWest;
export type RowBearing = Bearing.East | Bearing.NorthEast | Bearing.SouthEast;

/**
 * Our cell values will always be string values that will be evaluated as JS.
 */
export type FormulaType = string;
export type KeyboardShortcutType = string[][];

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
