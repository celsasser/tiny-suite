/**
 * @license MIT (see project's LICENSE file)
 */

import {
	getNoteIntervalSymbols,
	getNoteNameSymbols,
} from '../../../src/resource/library';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'library.ts'), function () {
	describe('getNoteIntervalSymbols', function () {
		it('should properly load our intervals definition', function () {
			const result = getNoteIntervalSymbols();
			expect(result).toEqual(require('../../../res/symbols/intervals.json'));
		});
	});

	describe('getNoteNameSymbols', function () {
		it('should properly load our note names definition', function () {
			const result = getNoteNameSymbols();
			expect(result).toEqual(require('../../../res/symbols/noteNames.json'));
		});
	});
});
