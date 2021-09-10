import { readFileSync } from 'fs';
import { MidiIoSong } from 'midi-file-io';
import { writeOutput } from '../../src/output';
import { CliOptions } from '../../src/types';
import * as tests from './expect/writeOutput.json';

describe('output', function () {
	describe('writeOutput', function () {
		tests.forEach(function ({ input, output, text }): void {
			it(text, async function () {
				await writeOutput(input.song as MidiIoSong, input.props as CliOptions);
				expect(readFileSync(input.props.outputFile, { encoding: 'binary' })).toEqual(
					readFileSync(output.path, { encoding: 'binary' })
				);
			});
		});
	});
});
