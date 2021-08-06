/**
 * @license MIT (see project's LICENSE file)
 */

import { randomizeElements } from '../../../src/core';
import { directoryToDescribeTitle } from '@tiny/core';

describe(directoryToDescribeTitle(__dirname, 'random'), function () {
	describe('randomizeElements', function () {
		it('should randomize without weights', function () {
			const source = [1, 2, 3, 4];
			const result = randomizeElements(source);
			expect(result).not.toContain(result);
		});

		it('should randomize with weights', function () {
			const source = [1, 2, 3, 4];
			const weights = [1, 1, 25, 25];
			const result = randomizeElements(source, weights);
			expect(result).not.toContain(result);
		});
	});
});
