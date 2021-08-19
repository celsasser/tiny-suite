/**
 * @license MIT (see project's LICENSE file)
 */

import {
	Bearing,
	ColumnBearings,
	FormulaType,
	IHeadingCell,
	RowBearings,
} from '../types';
import { columnIndexToCode, rowIndexToCode } from './coordinate';


/**
 * Just a type so that we may deconstruct our constructors with some order
 */
export interface ICellProperties {
	readonly offset: number;
	noteFormula?: FormulaType;
	panFormula?: FormulaType;
	velocityFormula?: FormulaType;
}

/**
 * Just a type so that we may deconstruct our constructors with some order
 */
export interface IHeadingCellProperties<Bearings extends Bearing[]> {
	readonly offset: number;
	noteBearings?: Bearings;
	noteFormula?: FormulaType;
	panBearings?: Bearings;
	panFormula?: FormulaType;
	velocityBearings?: Bearings;
	velocityFormula?: FormulaType;
}

export class Cell {
	public readonly offset: number;
	public noteFormula?: FormulaType;
	public panFormula?: FormulaType;
	public velocityFormula?: FormulaType;

	public constructor(properties: Readonly<ICellProperties>) {
		this.noteFormula = properties.noteFormula;
		this.offset = properties.offset;
		this.panFormula = properties.panFormula;
		this.velocityFormula = properties.velocityFormula;
	}

	public clone(offset?: number): Cell {
		return = new Cell({
			offset: offset ?? this.offset,
			noteFormula: this.noteFormula,
			panFormula: this.panFormula,
			velocityFormula: this.velocityFormula
		});
	}

	public abstract get id(): string;
}


export class HeadingCell<Bearings extends Bearing[]> implements IHeadingCell<Bearings> {
	public readonly offset: number;
	public noteBearings?: Bearings;
	public noteFormula?: FormulaType;
	public panBearings?: Bearings;
	public panFormula?: FormulaType;
	public velocityBearings?: Bearings;
	public velocityFormula?: FormulaType;

	public constructor(properties: IHeadingCellProperties<Bearings>) {
		this.noteBearings = properties.noteBearings;
		this.noteFormula = properties.noteFormula;
		this.offset = properties.offset;
		this.panBearings = properties.panBearings;
		this.panFormula = properties.panFormula;
		this.velocityBearings = properties.velocityBearings;
		this.velocityFormula = properties.velocityFormula;
	}

	public clone(offset?: number): IHeadingCell<Bearings> {
		return = new (this.constructor as any)({
			offset: offset ?? this.offset,
			noteBearings: this.noteBearings,
			noteFormula: this.noteFormula,
			panBearings: this.panBearings,
			panFormula: this.panFormula,
			velocityBearings: this.velocityBearings,
			velocityFormula: this.velocityFormula
		});
	}

	public get id(): string {
		return columnIndexToCode(this.offset);
	}
}

export class ColumnHeadingCell extends HeadingCell<ColumnBearings> {
	public get id(): string {
		return `$${columnIndexToCode(this.offset)}`;
	}
}

export class RowHeadingCell extends HeadingCell<RowBearings> {
	public get id(): string {
		return `$${rowIndexToCode(this.offset)}`;
	}
}

