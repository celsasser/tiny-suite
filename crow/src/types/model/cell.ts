/**
 * @license MIT (see project's LICENSE file)
 */

import { FormulaType } from './primitives';
import {
	Bearing,
	ColumnBearing,
	ICoordinate,
	IHashable,
	IValueServer,
	RowBearing,
} from './core';

export interface ICell extends IHashable, IValueServer {
	readonly coordinate: ICoordinate;
	/**
	 * this is the excel like name/id. For example, "$A1",
	 */
	readonly id: string;
	noteFormula?: FormulaType;
	panFormula?: FormulaType;
	velocityFormula?: FormulaType;

	clone(coordinate?: Readonly<ICoordinate>): ICell;
}

/**
 * Either a row and a column heading. This is where formulas are managed
 * and from which matrix algorithmic manipulations are made.
 */
export interface IHeadingCell<Bearings extends Bearing> extends IHashable, IValueServer {
	/**
	 * this is the excel like name/id.
	 * column example: "$A"
	 * row example: "$1"
	 */
	readonly id: string;
	readonly offset: number;
	bearings: Bearings[];
	noteFormula?: FormulaType;
	panFormula?: FormulaType;
	velocityFormula?: FormulaType;

	clone(offset?: number): IHeadingCell<Bearings>;
}

export type IColumnHeadingCell = IHeadingCell<ColumnBearing>;
export type IRowHeadingCell = IHeadingCell<RowBearing>;
