/**
 * @license MIT (see project's LICENSE file)
 */

import { MidiSharpFlatCount } from 'midi-file-io';

const noteNamesFlat = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];
const noteNamesSharp = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

export function midiNoteToName(note: number, key: MidiSharpFlatCount): string {
	const names = key < 1 ? noteNamesFlat : noteNamesSharp;
	const offset = note % 12;
	const octave = Math.floor(note / 12);
	return `${names[offset]}${octave}`;
}
