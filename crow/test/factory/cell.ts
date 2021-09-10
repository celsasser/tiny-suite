/**
 * @license MIT (see project's LICENSE file)
 */
import { Cell, ColumnHeadingCell, RowHeadingCell } from '../../src/model';
import {
	Bearing,
	ColumnBearingType,
	ICell,
	IColumnHeadingCell,
	ICoordinate,
	IRowHeadingCell,
	RowBearingType,
} from '../../src/types';

export const defaults: {
	cellColumnBearings: Bearing[];
	cellRowBearings: Bearing[];
	headingColumnBearings: ColumnBearingType;
	headingRowBearings: RowBearingType;
} = {
	cellColumnBearings: [Bearing.South],
	cellRowBearings: [Bearing.East],
	headingColumnBearings: [Bearing.South],
	headingRowBearings: [Bearing.East],
};

export function createTestCell(coordinate: Readonly<ICoordinate>): ICell {
	return new Cell({
		coordinate,
		noteFormula: `${coordinate.x}*${coordinate.y}`,
		panFormula: `${coordinate.x}+${coordinate.y}`,
		velocityFormula: `${coordinate.x}-${coordinate.y}`,
	});
}

export function createTestColumnHeadingCell(
	offset: number,
	bearings?: ColumnBearingType
): IColumnHeadingCell {
	return new ColumnHeadingCell({
		offset,
		noteBearings: bearings,
		noteFormula: `${offset}*1`,
		panBearings: bearings,
		panFormula: `64 - ${offset}`,
		velocityBearings: bearings,
		velocityFormula: `${offset}-1`,
	});
}

export function createTestRowHeadingCell(
	offset: number,
	bearings?: RowBearingType
): IRowHeadingCell {
	return new RowHeadingCell({
		offset,
		noteBearings: bearings,
		noteFormula: `${offset}*1`,
		panBearings: bearings,
		panFormula: `64 - ${offset}`,
		velocityBearings: bearings,
		velocityFormula: `${offset}-1}`,
	});
}
