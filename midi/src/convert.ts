import {
	MidiFileType,
	MidiIoEvent,
	MidiIoEventSubtype,
	MidiIoEventType,
	MidiIoHeader,
	MidiIoSong,
	MidiIoTrack,
} from 'midi-file-io';
import { CliOptions, MidiDeltaEvent, MidiOffsetEvent } from './types';
import { IChannel } from '@tiny/core';

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
	/**
	 * Creates an event list with offsets vs. relative deltas from the `channel`
	 */
	function _channelToOffsetEventArray(): MidiOffsetEvent[] {
		let offset = 0;
		const durationSequence = _circularNumericGenerator(
			channel.durations ? channel.durations : Number(options.pulsePerNote)
		);
		const velocitySequence = _circularNumericGenerator(
			channel.velocities ? channel.velocities : Number(options.velocity)
		);
		const events: MidiOffsetEvent[] = [];
		channel.notes.forEach((midiNoteOrNotes): void => {
			const { value: duration } = durationSequence.next();
			const { value: velocity } = velocitySequence.next();
			const midiNotes =
				typeof midiNoteOrNotes === 'number' ? [midiNoteOrNotes] : midiNoteOrNotes;
			midiNotes.forEach((midiNote) => {
				events.push({
					channel: channelIndex,
					noteNumber: midiNote,
					offset,
					subtype: MidiIoEventSubtype.NoteOn,
					type: MidiIoEventType.Channel,
					velocity,
				});
				events.push({
					channel: channelIndex,
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
