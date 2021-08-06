/**
 * @license MIT (see project's LICENSE file)
 */

import { stringToBoolean } from '../../../src/parse/primitives';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'parse'), function () {
	describe('stringToBoolean', function () {
		[
			{
				expected: true,
				input: 'true',
			},
			{
				expected: true,
				input: 'TRUE',
			},
			{
				expected: false,
				input: 'false',
			},
			{
				expected: false,
				input: 'FALSE',
			},
			{
				expected: true,
				input: '1',
			},
			{
				expected: false,
				input: '0',
			},
		].forEach(({ expected, input }) => {
			it(`${input} should parse to ${expected}`, function () {
				expect(stringToBoolean(input)).toEqual(expected);
			});
		});

		it('should throw an exception if not parsable', function () {
			expect(stringToBoolean.bind(null, 'george')).toThrow(
				'unable parse "george" as a boolean value'
			);
		});
	});
});
