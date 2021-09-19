/**
 * @license MIT (see project's LICENSE file)
 */

import { MidiSharpFlatCount } from 'midi-file-io';

const noteNamesFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const noteNamesSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function midiNoteToName(note: number, key: MidiSharpFlatCount): string {
	const names = key < 1 ? noteNamesFlat : noteNamesSharp;
	const offset = note % 12;
	const octave = Math.floor(note / 12);
	return `${names[offset]}${octave}`;
}
