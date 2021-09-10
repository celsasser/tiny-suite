/**
 * @license MIT (see project's LICENSE file)
 */

import { directoryToDescribeTitle } from '@tiny/core';
import {
	columnCodeToIndex,
	columnIndexToCode,
	coordinateFromId,
	coordinateToId,
	rowCodeToIndex,
	rowIndexToCode,
} from '../../../src/model';

describe(directoryToDescribeTitle(__dirname, 'cell'), function () {
	describe('columnIndexToCode/columnCodeToIndex', function () {
		[
			{ input: 0, output: 'A' },
			{ input: 1, output: 'B' },
			{ input: 25, output: 'Z' },
			{ input: 26, output: 'AA' },
			{ input: 27, output: 'AB' },
			{ input: 106, output: 'DC' },
		].forEach((test) => {
			it(`should return ${test.output} when input = ${test.input}`, function () {
				expect(columnIndexToCode(test.input)).toEqual(test.output);
				expect(columnCodeToIndex(test.output)).toEqual(test.input);
			});
		});

		it('columnCodeToIndex should throw an exception if invalid characters in code', function () {
			expect(columnCodeToIndex.bind(null, '$1')).toThrow(
				'unsupported column characters in "$1"'
			);
		});
	});

	describe('rowIndexToCode/rowCodeToIndex', function () {
		[
			{ input: 0, output: '1' },
			{ input: 1, output: '2' },
		].forEach((test) => {
			it(`should return ${test.output} when input = ${test.input}`, function () {
				expect(rowIndexToCode(test.input)).toEqual(test.output);
				expect(rowCodeToIndex(test.output)).toEqual(test.input);
			});
		});
	});

	describe('coordinateFromId', function () {
		it('should throw an error if the input is unrecognizable', function () {
			expect(coordinateFromId.bind(null, 'George')).toThrowError(
				'unrecognized coordinate id "George"'
			);
		});
	});

	describe('coordinateToId', function () {
		it('should properly translate a coordinate to an id', function () {
			expect(coordinateToId({ x: 0, y: 0 })).toEqual('$A1');
		});
	});
});
