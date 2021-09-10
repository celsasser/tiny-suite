/**
 * @license MIT (see project's LICENSE file)
 */

import { TinyParser } from '../../../src/language/parse';

describe('TinyParser', function () {
	describe('parse.fail', function () {
		require('./expect/parse.fail.json').forEach((test: any) => {
			it(`${test.title}: "${test.input}"`, function () {
				const instance = new TinyParser();
				expect(instance.parse.bind(instance, test.input)).toThrow(
					test.expected as string
				);
			});
		});
	});

	describe('parse.pass', function () {
		require('./expect/parse.pass.json').forEach((test: any) => {
			it(`${test.title}: "${test.input}"`, function () {
				const instance = new TinyParser();
				const result = instance.parse(test.input);
				expect(result).toEqual(test.expected);
			});
		});
	});
});
