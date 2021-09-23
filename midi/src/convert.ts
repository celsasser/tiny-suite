/**
 * @license MIT (see project's LICENSE file)
 */

import { getGeneralMidiProgramSymbols, IChannel } from '@tiny/core';
import {
	MidiChannelType,
	MidiFileType,
	MidiIoEvent,
	MidiIoEventSubtype,
	MidiIoEventType,
	MidiIoHeader,
	MidiIoSong,
	MidiIoTrack,
} from 'midi-file-io';
import { CliOptions, MidiDeltaEvent, MidiOffsetEvent } from './types';

/***********************
 * Public Interface
 **********************/
export function channelsToMidiFormat(
	options: Readonly<CliOptions>,
	channels: ReadonlyArray<Readonly<IChannel>>
): MidiIoSong {
	const header = _createMidiHeader(options, channels.length + 1);
	const tracks = channels.reduce(
		(tracks, channel, index) => {
			tracks.push(_createMidiTrack(options, channel, index));
			return tracks;
		},
		[_createMetadataTrack(options)]
	);
	return {
		header,
		tracks,
	};
}

/***********************
 * Private Utils
 **********************/
function* _circularNumericGenerator(value: number | number[]): Iterator<number> {
	const values = typeof value === 'number' ? [value] : value;
	for (let index = 0; true; index++) {
		yield values[index % values.length];
	}
}

/***********************
 * Private Interface
 **********************/
function _createMidiHeader(
	options: Readonly<CliOptions>,
	channelCount: number
): MidiIoHeader {
	return {
		formatType: MidiFileType.Simultaneous,
		ticksPerQuarter: Number(options.pulsePerQuarter),
		trackCount: channelCount,
	};
}

function _createMetadataTrack(options: Readonly<CliOptions>): MidiIoTrack {
	const events: MidiIoEvent[] = [
		{
			deltaTime: 0,
			microsecondsPerBeat: Math.round((60 / Number(options.tempo)) * 1000000),
			subtype: MidiIoEventSubtype.SetTempo,
			type: MidiIoEventType.Meta,
		},
		{
			deltaTime: 0,
			subtype: MidiIoEventSubtype.EndOfTrack,
			type: MidiIoEventType.Meta,
		},
	];
	return events;
}

function _createMidiTrack(
	options: Readonly<CliOptions>,
	channel: Readonly<IChannel>,
	channelIndex: number
): MidiIoTrack {
	function _justifyChannel(value: number): MidiChannelType {
		if (value < 0 || value > 15) {
			console.warn(`bad MIDI data: channel = ${value}`);
			return Math.max(0, Math.min(15, value)) as MidiChannelType;
		}
		return value as MidiChannelType;
	}
	function _justifyDuration(value: number): number {
		if (value < 0) {
			console.warn(`bad MIDI data: duration = ${value}`);
			return 0;
		}
		return value;
	}
	function _justifyNote(value: number): number {
		if (value < 0 || value > 127) {
			console.warn(`bad MIDI data: note = ${value}`);
			return Math.max(0, Math.min(127, value));
		}
		return value;
	}
	function _justifyVelocity(value: number): number {
		if (value < 0 || value > 127) {
			console.warn(`bad MIDI data: velocity = ${value}`);
			return Math.max(0, Math.min(127, value));
		}
		return value;
	}

	/**
	 * Creates an event list with offsets vs. relative deltas from the `channel`
	 */
	function _channelToOffsetEventArray(): MidiOffsetEvent[] {
		let offset = 0;
		const generalMidi = getGeneralMidiProgramSymbols().values;
		const durationSequence = _circularNumericGenerator(
			channel.durations ? channel.durations : Number(options.pulsePerNote)
		);
		const velocitySequence = _circularNumericGenerator(
			channel.velocities ? channel.velocities : Number(options.velocity)
		);
		const events: MidiOffsetEvent[] = [
			{
				offset: 0,
				subtype: MidiIoEventSubtype.TrackName,
				text: channel.name ?? `Track ${channelIndex + 1}`,
				type: MidiIoEventType.Meta,
			},
			{
				offset: 0,
				subtype: MidiIoEventSubtype.InstrumentName,
				text: channel.program ?? generalMidi['1'],
				type: MidiIoEventType.Meta,
			},
			{
				offset: 0,
				subtype: MidiIoEventSubtype.MidiChannelPrefix,
				type: MidiIoEventType.Meta,
				channel: channel.channel ?? 0,
			},
		];
		channel.notes.forEach((midiNoteOrNotes): void => {
			const duration = _justifyDuration(durationSequence.next().value);
			const velocity = _justifyVelocity(velocitySequence.next().value);
			const midiNotes =
				typeof midiNoteOrNotes === 'number' ? [midiNoteOrNotes] : midiNoteOrNotes;
			midiNotes.forEach((midiNote) => {
				midiNote = _justifyNote(midiNote);
				events.push({
					channel: _justifyChannel(channelIndex),
					noteNumber: midiNote,
					offset,
					subtype: MidiIoEventSubtype.NoteOn,
					type: MidiIoEventType.Channel,
					velocity,
				});
				events.push({
					channel: _justifyChannel(channelIndex),
					noteNumber: midiNote,
					offset: offset + duration,
					subtype: MidiIoEventSubtype.NoteOff,
					type: MidiIoEventType.Channel,
					velocity,
				});
			});
			offset += duration;
		});
		events.push({
			offset,
			subtype: MidiIoEventSubtype.EndOfTrack,
			type: MidiIoEventType.Meta,
		});
		return events.sort(
			(a: MidiOffsetEvent, b: MidiOffsetEvent): number => a.offset - b.offset
		);
	}

	/**
	 * Converts an offset event list to a delta based event list.
	 * Note: this does mutate the events directly.
	 */
	function _offsetEventArrayToDeltaEvents(
		offsetEventArray: ReadonlyArray<MidiOffsetEvent>
	): MidiIoEvent[] {
		let offset = 0;
		return offsetEventArray.reduce(
			(accumulator: MidiDeltaEvent[], offsetEvent: MidiOffsetEvent) => {
				const deltaEvent: MidiDeltaEvent = offsetEvent as unknown as MidiDeltaEvent;
				deltaEvent.deltaTime = offsetEvent.offset - offset;
				offset = offsetEvent.offset;
				delete (deltaEvent as any).offset;
				accumulator.push(deltaEvent);
				return accumulator;
			},
			[]
		);
	}

	const offsetArray = _channelToOffsetEventArray();
	const track = _offsetEventArrayToDeltaEvents(offsetArray);
	return track;
}
