/**
 * @license MIT (see project's LICENSE file)
 */

import { Cell, ColumnHeadingCell, RowHeadingCell } from '../../../src/model';
import {
	Bearing,
	ColumnBearing,
	FormulaType,
	ICoordinate,
	RowBearing,
} from '../../../src/types';

describe('cell', function () {
	const defaults: Readonly<{
		columnBearings: ColumnBearing[];
		coordinate: Readonly<ICoordinate>;
		offset: number;
		noteFormula: FormulaType;
		panFormula: FormulaType;
		rowBearings: RowBearing[];
		velocityFormula: FormulaType;
	}> = {
		columnBearings: [Bearing.South],
		coordinate: {
			x: 0,
			y: 1,
		},
		noteFormula: 'c#',
		offset: 1,
		panFormula: '0',
		rowBearings: [Bearing.East],
		velocityFormula: '84',
	};

	describe('Cell', function () {
		it('constructor should properly construct an instance', function () {
			const instance = new Cell(defaults.coordinate);
			expect(instance).toEqual({
				coordinate: defaults.coordinate,
			});
		});

		it('clone should properly clone an object with no changes', function () {
			const instance = new Cell(defaults.coordinate);
			instance.noteFormula = defaults.noteFormula;
			instance.panFormula = defaults.panFormula;
			instance.velocityFormula = defaults.velocityFormula;
			const clone = instance.clone();
			expect(clone).toEqual(instance);
		});

		it('clone should properly clone an object with changes', function () {
			const coordinate: ICoordinate = {
				x: 2,
				y: 2,
			};
			const instance = new Cell(defaults.coordinate);
			const clone = instance.clone(coordinate);
			expect(clone).toEqual({
				coordinate,
			});
		});
	});

	describe('ColumnHeadingCell', function () {
		it('constructor should properly construct an instance', function () {
			const instance = new ColumnHeadingCell(defaults.offset, defaults.columnBearings);
			expect(instance).toEqual({
				bearings: defaults.columnBearings,
				offset: defaults.offset,
			});
		});

		it('clone should properly clone an object with no changes', function () {
			const instance = new ColumnHeadingCell(defaults.offset, defaults.columnBearings);
			instance.noteFormula = defaults.noteFormula;
			instance.panFormula = defaults.panFormula;
			instance.velocityFormula = defaults.velocityFormula;
			const clone = instance.clone();
			expect(clone).toEqual(instance);
		});

		it('clone should properly clone an object with changes', function () {
			const instance = new ColumnHeadingCell(defaults.offset, defaults.columnBearings);
			const clone = instance.clone(defaults.offset + 1);
			expect(clone).toEqual({
				...instance,
				offset: defaults.offset + 1,
			});
		});

		it('id should render properly', function () {
			const instance = new ColumnHeadingCell(defaults.offset, defaults.columnBearings);
			expect(instance.id).toEqual('$B');
		});
	});

	describe('RowHeadingCell', function () {
		it('constructor should properly construct an instance', function () {
			const instance = new RowHeadingCell(defaults.offset, defaults.rowBearings);
			expect(instance).toEqual({
				bearings: defaults.rowBearings,
				offset: defaults.offset,
			});
		});

		it('clone should properly clone an object with no changes', function () {
			const instance = new RowHeadingCell(defaults.offset, defaults.rowBearings);
			instance.noteFormula = defaults.noteFormula;
			instance.panFormula = defaults.panFormula;
			instance.velocityFormula = defaults.velocityFormula;
			const clone = instance.clone();
			expect(clone).toEqual(instance);
		});

		it('clone should properly clone an object with changes', function () {
			const instance = new RowHeadingCell(defaults.offset, defaults.rowBearings);
			const clone = instance.clone(defaults.offset + 1);
			expect(clone).toEqual({
				...instance,
				offset: defaults.offset + 1,
			});
		});

		it('id should render properly', function () {
			const instance = new RowHeadingCell(defaults.offset, defaults.rowBearings);
			expect(instance.id).toEqual('$2');
		});
	});
});
