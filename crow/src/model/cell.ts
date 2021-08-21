/**
 * @license MIT (see project's LICENSE file)
 */

import {
	Bearing,
	ColumnBearingType,
	ColumnBearingValues,
	FormulaType,
	ICell,
	ICoordinate,
	IHeadingCell,
	RowBearingType,
	RowBearingValues,
} from '../types';
import { columnIndexToCode, coordinateToId, rowIndexToCode } from './coordinate';
import { assertBearingsSupported } from './utils';

/**
 * Just a type so that we may deconstruct our constructors with some order
 */
export interface ICellProperties {
	readonly coordinate: Readonly<ICoordinate>;
	noteFormula?: FormulaType;
	panFormula?: FormulaType;
	velocityFormula?: FormulaType;
}

/**
 * Just a type so that we may deconstruct our constructors with some order
 */
export interface IHeadingCellProperties<
	BearingType = ColumnBearingType | RowBearingType
> {
	readonly offset: number;
	noteBearings?: BearingType;
	noteFormula?: FormulaType;
	panBearings?: BearingType;
	panFormula?: FormulaType;
	velocityBearings?: BearingType;
	velocityFormula?: FormulaType;
}

export class Cell implements ICell {
	/**
	 * Either use `coordinate`s `toString() method or `coordinateToId`
	 */
	public readonly coordinate: ICoordinate;
	public noteFormula?: FormulaType;
	public panFormula?: FormulaType;
	public velocityFormula?: FormulaType;

	public constructor(properties: Readonly<ICellProperties>) {
		this.coordinate = properties.coordinate;
		this.noteFormula = properties.noteFormula;
		this.panFormula = properties.panFormula;
		this.velocityFormula = properties.velocityFormula;
	}

	public clone(coordinate?: ICoordinate): ICell {
		return new Cell({
			coordinate: coordinate ?? this.coordinate,
			noteFormula: this.noteFormula,
			panFormula: this.panFormula,
			velocityFormula: this.velocityFormula,
		});
	}

	public get id(): string {
		return coordinateToId(this.coordinate);
	}
}

export class HeadingCell<BearingType = ColumnBearingType | RowBearingType>
	implements IHeadingCell<BearingType>
{
	public readonly offset: number;
	public noteBearings?: BearingType;
	public noteFormula?: FormulaType;
	public panBearings?: BearingType;
	public panFormula?: FormulaType;
	public velocityBearings?: BearingType;
	public velocityFormula?: FormulaType;

	public constructor(
		properties: IHeadingCellProperties<BearingType>,
		bearingValues: ReadonlyArray<Bearing>
	) {
		// todo: I don't understand the issue with `noteBearings`, `panBearings` and `velocityBearings`
		assertBearingsSupported(
			'note',
			bearingValues,
			properties.noteBearings as unknown as ReadonlyArray<Bearing>
		);
		assertBearingsSupported(
			'pan',
			bearingValues,
			properties.panBearings as unknown as ReadonlyArray<Bearing>
		);
		assertBearingsSupported(
			'velocity',
			bearingValues,
			properties.velocityBearings as unknown as ReadonlyArray<Bearing>
		);
		this.noteBearings = properties.noteBearings;
		this.noteFormula = properties.noteFormula;
		this.offset = properties.offset;
		this.panBearings = properties.panBearings;
		this.panFormula = properties.panFormula;
		this.velocityBearings = properties.velocityBearings;
		this.velocityFormula = properties.velocityFormula;
	}

	public clone(offset?: number): IHeadingCell<BearingType> {
		return new (this.constructor as any)({
			offset: offset ?? this.offset,
			noteBearings: this.noteBearings,
			noteFormula: this.noteFormula,
			panBearings: this.panBearings,
			panFormula: this.panFormula,
			velocityBearings: this.velocityBearings,
			velocityFormula: this.velocityFormula,
		});
	}

	public get id(): string {
		return columnIndexToCode(this.offset);
	}
}

export class ColumnHeadingCell extends HeadingCell<ColumnBearingType> {
	constructor(properties: IHeadingCellProperties<ColumnBearingType>) {
		super(properties, ColumnBearingValues);
	}
	public get id(): string {
		return `$${columnIndexToCode(this.offset)}`;
	}
}

export class RowHeadingCell extends HeadingCell<RowBearingType> {
	constructor(properties: IHeadingCellProperties<RowBearingType>) {
		super(properties, RowBearingValues);
	}
	public get id(): string {
		return `$${rowIndexToCode(this.offset)}`;
	}
}
