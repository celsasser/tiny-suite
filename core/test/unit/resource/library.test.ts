/**
 * @license MIT (see project's LICENSE file)
 */

import {
	getMidiDefaultSymbols,
	getMidiNoteIntervalSymbols,
	getMidiNoteNameSymbols,
} from '../../../src/resource';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'library.ts'), function () {
	describe('getMidiNoteIntervalSymbols', function () {
		it('should properly load our intervals definition', function () {
			const result = getMidiDefaultSymbols();
			expect(result).toEqual(require('../../../res/midi/symbols/defaults.json'));
		});
	});

	describe('getMidiNoteIntervalSymbols', function () {
		it('should properly load our intervals definition', function () {
			const result = getMidiNoteIntervalSymbols();
			expect(result).toEqual(require('../../../res/midi/symbols/intervals.json'));
		});
	});

	describe('getMidiNoteNameSymbols', function () {
		it('should properly load our note names definition', function () {
			const result = getMidiNoteNameSymbols();
			expect(result).toEqual(require('../../../res/midi/symbols/noteNames.json'));
		});
	});
});
