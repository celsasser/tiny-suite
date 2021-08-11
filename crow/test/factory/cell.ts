/**
 * @license MIT (see project's LICENSE file)
 */
import { Cell, ColumnHeadingCell, RowHeadingCell } from '../../src/model';
import {
	Bearing,
	ColumnBearing,
	ICell,
	IColumnHeadingCell,
	ICoordinate,
	IRowHeadingCell,
	RowBearing,
} from '../../src/types';

export const defaults: {
	cellColumnBearings: Bearing[];
	cellRowBearings: Bearing[];
	headingColumnBearings: ColumnBearing[];
	headingRowBearings: RowBearing[];
} = {
	cellColumnBearings: [Bearing.South],
	cellRowBearings: [Bearing.South],
	headingColumnBearings: [Bearing.South],
	headingRowBearings: [Bearing.East],
};

export function createTestCell(coordinate: Readonly<ICoordinate>): ICell {
	const value = new Cell(coordinate);
	value.noteFormula = `${coordinate.x}*${coordinate.y}`;
	value.panFormula = `${coordinate.x}+${coordinate.y}`;
	value.velocityFormula = `${coordinate.x}-${coordinate.y}`;
	return value;
}

export function createTestColumnHeadingCell(offset: number): IColumnHeadingCell {
	const value = new ColumnHeadingCell(offset, defaults.headingColumnBearings);
	value.noteFormula = `${offset}*1`;
	value.panFormula = `${offset}+1`;
	value.velocityFormula = `${offset}-1}`;
	return value;
}

export function createTestRowHeadingCell(offset: number): IRowHeadingCell {
	const value = new RowHeadingCell(offset, defaults.headingRowBearings);
	value.noteFormula = `${offset}*1`;
	value.panFormula = `${offset}+1`;
	value.velocityFormula = `${offset}-1}`;
	return value;
}
