/**
 * @license MIT (see project's LICENSE file)
 */

import { midiNoteToName, writeStdout } from '@tiny/core';
import { stringToInteger } from '@tiny/core/build';
import * as _ from 'lodash';
import {
	MidiChannelType,
	MidiIoEventSubtype,
	MidiIoSong,
	MidiIoTrack,
} from 'midi-file-io';
import { CliFormatTypes, CliOptions } from './types';

type MidiNoteFormatter = (note: number) => string;

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

	let dumpTracks: MidiIoTrack[];
	if (options.outputChannel) {
		const channel = stringToInteger(options.outputChannel) - 1;
		dumpTracks = data.tracks.filter((track) => trackToChannel(track) === channel);
	} else {
		dumpTracks = data.tracks;
	}

	let noteFormatter: MidiNoteFormatter;
	if (options.noteNames) {
		const sharpFlatCount: number = _.get(
			data.tracks[0].find((event) => event.subtype === MidiIoEventSubtype.KeySignature),
			'key',
			0
		);
		noteFormatter = _.partialRight(midiNoteToName, sharpFlatCount) as MidiNoteFormatter;
	} else {
		noteFormatter = (note: number) => note.toString();
	}

	switch (options.outputFormat) {
		case CliFormatTypes.Detailed: {
			return createDetailedFormat(data, dumpTracks, noteFormatter);
		}
		default: {
			return createSimpleFormat(data, dumpTracks, noteFormatter);
		}
	}
}

function createDetailedFormat(
	data: Readonly<MidiIoSong>,
	tracks: ReadonlyArray<MidiIoTrack>,
	noteFormatter: MidiNoteFormatter
): string {
	// todo: for now forwarding to `createSimpleFormat`. Let's see what we want from this guy
	createSimpleFormat(data, tracks, noteFormatter);
	return 'detailed';
}

function createSimpleFormat(
	data: Readonly<MidiIoSong>,
	tracks: ReadonlyArray<MidiIoTrack>,
	noteFormatter: MidiNoteFormatter
): string {
	let songData = tracks.map((track) => {
		const trackData: {
			channel: MidiChannelType | undefined;
			notes: string[];
		} = {
			channel: undefined,
			notes: [],
		};
		return track.reduce((trackData, event) => {
			if (trackData.channel === undefined && event.channel !== undefined) {
				trackData.channel = event.channel;
			}
			if (event.subtype === MidiIoEventSubtype.NoteOn) {
				trackData.notes.push(noteFormatter(event.noteNumber!));
			}
			return trackData;
		}, trackData);
	});
	songData = _.sortBy(songData, 'channel');
	return JSON.stringify(songData, null, '   ');
}
