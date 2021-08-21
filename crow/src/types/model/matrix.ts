/**
 * @license MIT (see project's LICENSE file)
 */

import { ICell, IColumnHeadingCell, IRowHeadingCell } from './cell';
import { Bearing, ICoordinate, ISize, KeyboardShortcutType } from './core';

export type MatrixGrid = ICell[][];

/**
 * Combination of a row heading and a column heading. We give it a name and a
 * keyboard shortcut so that the heading may be changed independently of the matrix
 */
export interface IMatrixHeading {
	/**
	 * You may modify and replace column values but must use size to change
	 * the dimensions
	 */
	readonly columns: ReadonlyArray<IColumnHeadingCell>;
	/**
	 * You may modify and replace row values but must use size to change
	 * the dimensions
	 */
	readonly rows: ReadonlyArray<IRowHeadingCell>;
	/**
	 * Modifies the size of the grid and the heading. These will be managed separately
	 * but we will enforce that one follows the other when size is updated through our
	 * factories.
	 */
	size: ISize;
	/**
	 * Optional name should you want to create more than one heading for a section
	 */
	name?: string;
	shortcut?: KeyboardShortcutType;
}

/**
 * Matrix is the core. It does not include headings. We don't want to couple
 * the two but rather offer a DJ like machine with the ability to place
 * other algorithms over the matrix. I am going to call it `ISection`?
 */
export interface IMatrix {
	size: ISize;

	clone(): IMatrix;

	/**
	 * Gets a single cell in the matrix
	 */
	getCell(coordinate: Readonly<ICoordinate>): ICell;

	/**
	 * Gets a single cell by its full coordinate name: "$<A-Z><row+1>"
	 */
	getCellById(name: string): ICell;

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
