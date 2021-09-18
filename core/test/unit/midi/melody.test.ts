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
				expect: 'C0',
			},
			{
				note: 1,
				key: 0,
				expect: 'Db0',
			},
			{
				note: 1,
				key: 1,
				expect: 'C#0',
			},
			{
				note: 12,
				key: 0,
				expect: 'C1',
			},
			{
				note: 13,
				key: 0,
				expect: 'Db1',
			},
			{
				note: 13,
				key: 1,
				expect: 'C#1',
			},
		].forEach((item) => {
			it(`should return ${item.expect} for note=${item.note}, key=${item.key}`, function () {
				const result = midiNoteToName(item.note, item.key as MidiSharpFlatCount);
				expect(result).toEqual(item.expect);
			});
		});
	});
});
