/**
 * @license MIT (see project's LICENSE file)
 */

import { Cell, ColumnHeadingCell, Matrix, MatrixHeading, RowHeadingCell } from '../model';
import { Section, Song } from '../model/song';
import {
	Bearing,
	ColumnBearing,
	FormulaType,
	ICell,
	IColumnHeadingCell,
	ICoordinate,
	IMatrix,
	IMatrixHeading,
	IRowHeadingCell,
	ISection,
	ISize,
	ISong,
	RowBearing,
} from '../types';

/**
 * We may want for our headings to have separate formula defaults
 */
const defaults: Readonly<{
	columnBearings: ReadonlyArray<ColumnBearing>;
	columnNoteFormula?: FormulaType;
	columnPanFormula?: FormulaType;
	columnVelocityFormula?: FormulaType;
	matrixSize: Readonly<ISize>;
	rowBearings: ReadonlyArray<RowBearing>;
	rowNoteFormula?: FormulaType;
	rowPanFormula?: FormulaType;
	rowVelocityFormula?: FormulaType;
}> = {
	columnBearings: [Bearing.South],
	matrixSize: { width: 8, height: 8 },
	rowBearings: [Bearing.East],
};

export function createCell(coordinate: Readonly<ICoordinate>): ICell {
	const cell = new Cell(coordinate);
	cell.noteFormula = defaults.columnNoteFormula;
	cell.panFormula = defaults.columnPanFormula;
	cell.velocityFormula = defaults.columnVelocityFormula;
	return cell;
}

export function createColumnHeadingCell(offset: number): IColumnHeadingCell {
	const cell = new ColumnHeadingCell(offset, defaults.columnBearings.slice());
	cell.noteFormula = defaults.columnNoteFormula;
	cell.panFormula = defaults.columnPanFormula;
	cell.velocityFormula = defaults.columnVelocityFormula;
	return cell;
}

export function createHeading(
	size: Readonly<ISize> = defaults.matrixSize
): IMatrixHeading {
	const heading = new MatrixHeading([], []);
	heading.size = size;
	return heading;
}

export function createMatrix(size: ISize = defaults.matrixSize): IMatrix {
	const matrix = new Matrix([]);
	matrix.size = size;
	return matrix;
}

export function createRowHeadingCell(offset: number): IRowHeadingCell {
	const cell = new RowHeadingCell(offset, defaults.rowBearings.slice());
	cell.noteFormula = defaults.rowNoteFormula;
	cell.panFormula = defaults.rowPanFormula;
	cell.velocityFormula = defaults.rowVelocityFormula;
	return cell;
}

export function createSection(size: Readonly<ISize> = defaults.matrixSize): ISection {
	const matrix = createMatrix(size);
	const heading = createHeading(size);
	return new Section({
		headings: [heading],
		matrix,
		size,
	});
}

export function createSong(size: Readonly<ISize> = defaults.matrixSize): ISong {
	const section = createSection(size);
	return new Song([section]);
}
