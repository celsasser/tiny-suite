/**
 * @license MIT (see project's LICENSE file)
 */

import { generateTinySequence } from '../../../src/language';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'generateTinySequence'), function () {
	describe('evaluate.fail', function () {
		require('./expect/evaluate.fail.json').forEach((test: any) => {
			it(`${test.title}: initalValue=${test.initialValue}, code=${test.code}`, function () {
				expect(() => generateTinySequence(test.code, test.symbols)).toThrowError(
					test.expected as string
				);
			});
		});
	});

	describe('evaluate.pass', function () {
		require('./expect/evaluate.pass.json').forEach((test: any) => {
			it(`${test.title}: initalValue=${test.initialValue}, code=${test.code}`, function () {
				expect(generateTinySequence(test.code, test.symbols)).toEqual(test.expected);
			});
		});
	});
});
