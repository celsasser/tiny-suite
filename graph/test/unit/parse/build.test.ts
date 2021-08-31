/**
 * @license MIT (see project's LICENSE file)
 */

import * as _ from 'lodash';
import { directoryToDescribeTitle, getMidiNoteNameSymbols } from '@tiny/core';
import { _propertyValueToServer } from '../../../src/parse/build';
import { FunctionName, TinySymbolTable } from '../../../src/types';
import * as propertyValueToServerTests from './expect/propertyValueToServer.json';

describe(directoryToDescribeTitle(__dirname, 'build.ts'), function () {
	describe('_propertyValueToServer', function () {
		const symbols = new TinySymbolTable({ symbols: getMidiNoteNameSymbols().values });
		/**
		 * Non random tests
		 */
		propertyValueToServerTests.deterministic.forEach((test) => {
			it(`${test.input}: ${test.text}`, function () {
				const server = _propertyValueToServer(test.input, symbols);
				test.output.forEach((scalar: number[]) => {
					expect(server()).toEqual(scalar);
				});
			});
		});
		/**
		 * Random tests
		 */
		propertyValueToServerTests.random.forEach((test) => {
			it(`${test.input}: ${test.text}`, function () {
				const server = _propertyValueToServer(test.input, symbols);
				for (let index = 0; index < 5; index++) {
					const result = server();
					expect(_.difference(result, test.output)).toEqual([]);
				}
			});
		});

		it('randomGrouping should raise an exception if "cycle" & "reuse" are combined', function () {
			expect(
				_propertyValueToServer.bind(
					null,
					'randomGrouping([1], [1-1], [cycle, reuse])',
					symbols
				)
			).toThrow(`"${FunctionName.RandomGrouping}" with "cycle" does not support "reuse"`);
		});

		it('randomSelection should raise an exception if "cycle" & "reuse" are combined', function () {
			expect(
				_propertyValueToServer.bind(null, 'randomSelection([1], [cycle, reuse])', symbols)
			).toThrow(
				`"${FunctionName.RandomSelection}" with "cycle" does not support "reuse"`
			);
		});
	});
});
