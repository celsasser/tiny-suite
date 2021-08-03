/**
 * @license MIT (see project's LICENSE file)
 */

import { appendArray } from '../../../src/core';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'array'), function () {
	describe('appendArray', function () {
		it('should properly append an empty array', function () {
			const array: number[] = [];
			appendArray(array, [1]);
			expect(array).toEqual([1]);
		});

		it('should properly append multiple items', function () {
			const array: number[] = [1, 2];
			appendArray(array, [3, 4]);
			expect(array).toEqual([1, 2, 3, 4]);
		});
	});
});
