/**
 * @license MIT (see project's LICENSE file)
 */

import {
	stringToBoolean,
	stringToInteger,
	stringToIntegers,
	trimString,
} from '../../../src/parse/primitives';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'primitives'), function () {
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

	describe('stringToInteger', function () {
		it('should parse an int', function () {
			expect(stringToInteger('10')).toEqual(10);
		});

		it('should floor an int', function () {
			expect(stringToInteger('10.1')).toEqual(10);
		});

		it('should raise exception if not an int', function () {
			expect(stringToInteger.bind(null, 'George')).toThrow(
				'unable to parse "George" as an integer value'
			);
		});
	});

	describe('stringToIntegers', function () {
		it('should parse an array of int', function () {
			expect(stringToIntegers('[10]')).toEqual([10]);
		});

		it('should ignore space', function () {
			expect(stringToIntegers(' [ 10 ] ')).toEqual([10]);
		});

		it('should raise exception if not an array', function () {
			expect(stringToIntegers.bind(null, 'George')).toThrow(
				'unable to parse "George" as an array of integers'
			);
		});
	});

	describe('trimString', function () {
		[
			{
				expected: 'stuff',
				input: 'stuff',
			},
			{
				expected: 'stuff',
				input: ' stuff ',
			},
			{
				expected: undefined,
				input: undefined,
			},
			{
				expected: undefined,
				input: ' ',
			},
		].forEach(({ expected, input }) => {
			it(`${input} should parse to ${expected}`, function () {
				expect(trimString(input)).toEqual(expected);
			});
		});
	});
});
