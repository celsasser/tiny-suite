/**
 * @license MIT (see project's LICENSE file)
 */

import {
	Bearing,
	ColumnBearings,
	FormulaType,
	ICoordinate,
	IHashable,
	IValueServer,
	RowBearings,
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
 * Describes a column or row heading cell. This is where formulas are
 * managed and from which matrix algorithmic manipulations are made.
 */
export interface IHeadingCell<Bearings extends Bearing[]>
	extends IHashable,
		IValueServer {
	/**
	 * this is the excel like name/id.
	 * column example: "$A"
	 * row example: "$1"
	 */
	readonly id: string;
	readonly offset: number;
	/**
	 * I am thinking we begin by treating these guys as offsets.
	 * Another possibility is to leave it to the cell. But then
	 * we will have to be aware of how we process our cells. I mean,
	 * we already do, but the bearings add more processing. This may
	 * be an argument against it and treating all heading operations as
	 * `offset` values.
	 */
	noteFormula?: FormulaType;
	noteBearings?: Bearings;
	panFormula?: FormulaType;
	panBearings?: Bearings;
	velocityFormula?: FormulaType;
	velocityBearings?: Bearings;

	clone(offset?: number): IHeadingCell<Bearings>;
}

export type IColumnHeadingCell = IHeadingCell<ColumnBearings>;
export type IRowHeadingCell = IHeadingCell<RowBearings>;
