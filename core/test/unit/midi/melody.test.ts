/**
 * @license MIT (see project's LICENSE file)
 */

import { MidiSharpFlatCount } from 'midi-file-io';
import { midiNoteToName } from '../../../src/midi';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'melody'), function () {
	describe('noteNumberToName', function () {
		[
			{
				note: 0,
				key: 0,
				expect: 'c0',
			},
			{
				note: 1,
				key: 0,
				expect: 'db0',
			},
			{
				note: 1,
				key: 1,
				expect: 'c#0',
			},
			{
				note: 12,
				key: 0,
				expect: 'c1',
			},
			{
				note: 13,
				key: 0,
				expect: 'db1',
			},
			{
				note: 13,
				key: 1,
				expect: 'c#1',
			},
		].forEach((item) => {
			it(`should return ${item.expect} for note=${item.note}, key=${item.key}`, function () {
				const result = midiNoteToName(item.note, item.key as MidiSharpFlatCount);
				expect(result).toEqual(item.expect);
			});
		});
	});
});
