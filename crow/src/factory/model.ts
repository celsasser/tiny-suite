/**
 * @license MIT (see project's LICENSE file)
 */

import {
	Cell,
	ColumnHeadingCell,
	Matrix,
	MatrixHeading,
	RowHeadingCell,
	Section,
	Song,
} from '../model';
import {
	Bearing,
	ColumnBearingType,
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
	RowBearingType,
} from '../types';

/**
 * We may want for our headings to have separate formula defaults
 */
const defaults: Readonly<{
	columnBearings: ColumnBearingType;
	columnNoteFormula?: FormulaType;
	columnPanFormula?: FormulaType;
	columnVelocityFormula?: FormulaType;
	matrixSize: Readonly<ISize>;
	rowBearings: RowBearingType;
	rowNoteFormula?: FormulaType;
	rowPanFormula?: FormulaType;
	rowVelocityFormula?: FormulaType;
}> = {
	columnBearings: [Bearing.South],
	matrixSize: { width: 8, height: 8 },
	rowBearings: [Bearing.East],
};

export function createCell(coordinate: Readonly<ICoordinate>): ICell {
	return new Cell({
		coordinate,
		noteFormula: defaults.columnNoteFormula,
		panFormula: defaults.columnPanFormula,
		velocityFormula: defaults.columnVelocityFormula,
	});
}

export function createColumnHeadingCell(offset: number): IColumnHeadingCell {
	return new ColumnHeadingCell({
		noteBearings: defaults.columnBearings.slice(),
		noteFormula: defaults.columnNoteFormula,
		offset,
		panBearings: defaults.columnBearings.slice(),
		panFormula: defaults.columnNoteFormula,
		velocityBearings: defaults.columnBearings.slice(),
		velocityFormula: defaults.columnVelocityFormula,
	});
}

export function createMatrixHeading(
	size: Readonly<ISize> = defaults.matrixSize
): IMatrixHeading {
	const heading = new MatrixHeading([], []);
	// a crafty way of getting him to do the work of allocating columns, rows and cells
	heading.size = size;
	return heading;
}

export function createMatrix(size: ISize = defaults.matrixSize): IMatrix {
	const matrix = new Matrix([]);
	// a crafty way of getting him to do the work of allocating columns, rows and cells
	matrix.size = size;
	return matrix;
}

export function createRowHeadingCell(offset: number): IRowHeadingCell {
	return new RowHeadingCell({
		noteBearings: defaults.rowBearings.slice(),
		noteFormula: defaults.rowNoteFormula,
		offset,
		panBearings: defaults.rowBearings.slice(),
		panFormula: defaults.rowNoteFormula,
		velocityBearings: defaults.rowBearings.slice(),
		velocityFormula: defaults.rowVelocityFormula,
	});
}

export function createSection(size: Readonly<ISize> = defaults.matrixSize): ISection {
	const matrix = createMatrix(size);
	const heading = createMatrixHeading(size);
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
