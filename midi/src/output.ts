import { writeStdout } from '@tiny/core';
import { MidiIoSong, writeMidiToBuffer, writeMidiToFile } from 'midi-file-io';
import { CliOptions } from './types';

export async function writeOutput(
	song: Readonly<MidiIoSong>,
	options: Readonly<CliOptions>
): Promise<void> {
	try {
		if (options.outputFile) {
			writeMidiToFile(song, options.outputFile);
		} else {
			const buffer = writeMidiToBuffer(song);
			await writeStdout(buffer);
		}
	} catch (error) {
		throw new Error(`attempt to write failed: ${error.message}`);
	}
}
