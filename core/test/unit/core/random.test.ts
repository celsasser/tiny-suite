/**
 * @license MIT (see project's LICENSE file)
 */

import * as subject from '../../../src/core';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'random'), function () {
	describe('randomElementFromArray', function () {
		it(`should properly forward request to randomIntegerFromRange`, function () {
			const elements = [1, 2, 3];
			Math.random = jest.fn().mockReturnValue(0.5);
			expect(subject.randomElementFromArray(elements)).toEqual(2);
		});
	});

	describe('randomIntegerFromRange', function () {
		[
			{ min: 0, max: 0 },
			{ min: 0, max: 1 },
			{ min: 1, max: 2 },
			{ min: 1, max: 10 },
		].forEach((irange) => {
			it(`should generate random number within ${JSON.stringify(irange)}`, function () {
				const result = subject.randomIntegerFromRange(irange);
				expect(result).toBeGreaterThanOrEqual(irange.min);
				expect(result).toBeLessThanOrEqual(irange.max);
			});
		});
	});

	describe('randomizeElements', function () {
		it('should properly randomize elements without weights', function () {
			const elements = [9, 0, 8, 1, 7];
			const randomSequence = [0.9, 0, 0.8, 0.1, 0.7];
			Math.random = jest.fn(() => {
				return randomSequence.shift()!;
			});
			expect(subject.randomizeElements(elements)).toEqual([0, 1, 7, 8, 9]);
		});
	});
});
