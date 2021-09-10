/**
 * @license MIT (see project's LICENSE file)
 */

import { symbolsToIntegers, symbolToInteger } from '../../../src/parse';
import * as primitives from '../../../src/parse/primitives';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'symbols'), function () {
	describe('symbolToInteger', function () {
		it('should forward to stringToInteger if an integer', function () {
			jest.spyOn(primitives, 'stringToInteger');
			expect(symbolToInteger('10')).toEqual(10);
			expect(primitives.stringToInteger).toBeCalledWith('10');
		});

		it('should parse a known symbol', function () {
			jest.spyOn(primitives, 'stringToInteger');
			expect(symbolToInteger('C5')).toEqual(72);
			expect(primitives.stringToInteger).not.toHaveBeenCalled();
		});
	});

	describe('symbolsToIntegers', function () {
		it('should properly forward elements to symbolToInteger', function () {
			expect(symbolsToIntegers('[ 10, c5 ]')).toEqual([10, 72]);
		});

		it('should raise exception if not an array', function () {
			expect(symbolsToIntegers.bind(null, 'George')).toThrow(
				'unable to parse "George" as an array of integers'
			);
		});
	});
});
