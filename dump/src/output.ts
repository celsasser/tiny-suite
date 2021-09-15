/**
 * @license MIT (see project's LICENSE file)
 */

import { writeStdout } from '@tiny/core';
import { doWhile, stringToInteger } from '@tiny/core/build';
import { MidiIoSong, MidiIoTrack } from 'midi-file-io';
import { CliFormatTypes, CliOptions } from './types';

/**
 * Writes generated sequence to stdout or to a file
 * @param data
 * @param options
 */
export async function writeOutput(
	data: Readonly<MidiIoSong>,
	options: Readonly<CliOptions>
): Promise<void> {
	const formatted: string = formatData(data, options);
	await writeStdout(formatted);
}

function formatData(data: Readonly<MidiIoSong>, options: Readonly<CliOptions>): string {
	function trackToChannel(track: Readonly<MidiIoTrack>): number | undefined {
		for (let event of track) {
			if (event.channel !== undefined) {
				return event.channel;
			}
		}
	}

	let tracks: MidiIoTrack[];
	if (options.outputChannel) {
		const channel = stringToInteger(options.outputChannel) - 1;
		tracks = data.tracks.filter((track) => trackToChannel(track) === channel);
	} else {
		tracks = data.tracks;
	}
	switch (options.outputFormat) {
		case CliFormatTypes.Detailed: {
			return createDetailedFormat(data, tracks);
		}
		default: {
			return createSimpleFormat(data, tracks);
		}
	}
}

function createDetailedFormat(data: Readonly<MidiIoSong>, tracks: MidiIoTrack[]): string {
	return 'detailed';
}

function createSimpleFormat(data: Readonly<MidiIoSong>, tracks: MidiIoTrack[]): string {
	return 'simple';
}
