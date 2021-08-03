/**
 * @license MIT (see project's LICENSE file)
 */

import { randomIntegerFromRange } from '../../../src/core';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'random'), function () {
	describe('randomIntegerFromRange', function () {
		[
			{ min: 0, max: 0 },
			{ min: 0, max: 1 },
			{ min: 1, max: 2 },
			{ min: 1, max: 10 },
		].forEach((irange) => {
			it(`should generate random number within ${JSON.stringify(irange)}`, function () {
				const result = randomIntegerFromRange(irange);
				expect(result).toBeGreaterThanOrEqual(irange.min);
				expect(result).toBeLessThanOrEqual(irange.max);
			});
		});
	});
});
