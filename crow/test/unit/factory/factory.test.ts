/**
 * @license MIT (see project's LICENSE file)
 */

import { directoryToDescribeTitle } from '@tiny/core';
import { Bearing } from '../../../src/types';
import {
	createTestCell,
	createTestColumnHeadingCell,
	createTestRowHeadingCell,
} from '../../factory/cell';

describe(directoryToDescribeTitle(__dirname, 'factory'), function () {
	describe('createTestCell', function () {
		it('should properly create a cell class', function () {
			const cell = createTestCell({ x: 2, y: 1 });
			expect(cell).toEqual({
				coordinate: {
					x: 2,
					y: 1,
				},
				noteFormula: '2*1',
				panFormula: '2+1',
				velocityFormula: '2-1',
			});
		});

		it('should generate a proper id', function () {
			const cell = createTestCell({ x: 2, y: 1 });
			const id = cell.id;
			expect(id).toEqual('$C2');
		});
	});

	describe('createTestColumnHeadingCell', function () {
		it('should properly create a heading cell class', function () {
			const cell = createTestColumnHeadingCell(2, [Bearing.South]);
			expect(cell).toEqual({
				noteBearings: ['south'],
				noteFormula: '2*1',
				offset: 2,
				panBearings: ['south'],
				panFormula: '64 - 2',
				velocityBearings: ['south'],
				velocityFormula: '2-1',
			});
		});

		it('should generate a proper id', function () {
			const cell = createTestColumnHeadingCell(2);
			const id = cell.id;
			expect(id).toEqual('$C');
		});

		it('should throw an assertion if bearing is not supported', function () {
			expect(createTestColumnHeadingCell.bind(null, 2, [Bearing.East])).toThrow(
				'unsupported note bearings in east'
			);
		});
	});

	describe('createTestRowHeadingCell', function () {
		it('should properly create a heading cell class', function () {
			const cell = createTestRowHeadingCell(2, [Bearing.South]);
			expect(cell).toEqual({
				noteBearings: ['south'],
				noteFormula: '2*1',
				offset: 2,
				panBearings: ['south'],
				panFormula: '64 - 2',
				velocityBearings: ['south'],
				velocityFormula: '2-1',
			});
		});

		it('should generate a proper id', function () {
			const cell = createTestRowHeadingCell(2);
			const id = cell.id;
			expect(id).toEqual('$C');
		});
	});
});
