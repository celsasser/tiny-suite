/**
 * @license MIT (see project's LICENSE file)
 */

import { Bearing, ISize, NumberServer } from './primitives';

export interface ICell {
	readonly column: number;
	readonly row: number;
	value: number;
}

/**
 * Either a row and a column heading. This is where formulas are managed
 * and from which matrix algorithmic manipulations are made.
 */
export interface IHeading {
	column: ReadonlyArray<IFormulaCell>;
	name: string;
	row: ReadonlyArray<IFormulaCell>;
	size: ISize;
}

export interface IFormulaCell {
	readonly offset: number;
	bearing: Bearing;
	server?: NumberServer;
}

export interface IMatrix {
	size: ISize;

	/**
	 * Gets a single cell in the matrix
	 */
	getCell(column: number, row: number): ICell;
	/**
	 * Gets a sequence of cells. It will always be from the left-most or top-most
	 * position and continue as far as it can.
	 */
	getColumnCells(
		column: number,
		bearing: Bearing.South | Bearing.SouthEast | Bearing.SouthWest
	): ICell[];
	/**
	 * Gets a sequence of cells. It will always be from the left-most or top-most
	 * position and continue as far as it can.
	 */
	getRowCells(
		row: number,
		bearing: Bearing.East | Bearing.NorthEast | Bearing.SouthEast
	): ICell[];
}

export interface IPattern {
	headings: IHeading[];
	matrix: IMatrix;
	name: string;
	shortcuts: string[][];
}

export interface ISong {
	patterns: IPattern[];
}
