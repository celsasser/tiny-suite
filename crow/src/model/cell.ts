/**
 * @license MIT (see project's LICENSE file)
 */
import {
	Bearing,
	ColumnBearing,
	FormulaType,
	ICell,
	ICoordinate,
	IHeadingCell,
	RowBearing,
} from '../types';
import { columnIndexToCode, coordinateToId, rowIndexToCode } from './coordinate';

export class Cell implements ICell {
	public readonly coordinate: Readonly<ICoordinate>;
	public noteFormula?: FormulaType;
	public panFormula?: FormulaType;
	public velocityFormula?: FormulaType;

	public constructor(coordinate: Readonly<ICoordinate>) {
		this.coordinate = coordinate;
	}

	public clone(coordinate?: Readonly<ICoordinate>): ICell {
		const clone = new Cell(coordinate ?? this.coordinate);
		clone.noteFormula = this.noteFormula;
		clone.panFormula = this.panFormula;
		clone.velocityFormula = this.velocityFormula;
		return clone;
	}

	public get id(): string {
		return coordinateToId(this.coordinate);
	}
}

/**
 * @private
 */
abstract class HeadingCell<Bearings extends Bearing> implements IHeadingCell<Bearings> {
	public readonly offset: number;
	public bearings: Bearings[];
	public noteFormula?: FormulaType;
	public panFormula?: FormulaType;
	public velocityFormula?: FormulaType;

	public constructor(offset: number, bearings: Bearings[]) {
		this.offset = offset;
		this.bearings = bearings;
	}

	public clone(offset?: number): IHeadingCell<Bearings> {
		const clone = new (this.constructor as any)(
			offset ?? this.offset,
			this.bearings.slice()
		);
		clone.noteFormula = this.noteFormula;
		clone.panFormula = this.panFormula;
		clone.velocityFormula = this.velocityFormula;
		return clone;
	}

	public abstract get id(): string;
}

export class ColumnHeadingCell extends HeadingCell<ColumnBearing> {
	public get id(): string {
		return `$${columnIndexToCode(this.offset)}`;
	}
}

export class RowHeadingCell extends HeadingCell<RowBearing> {
	public get id(): string {
		return `$${rowIndexToCode(this.offset)}`;
	}
}
