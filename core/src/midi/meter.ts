/**
 * @license MIT (see project's LICENSE file)
 */

import { getMidiDefaultSymbols } from '../resource';
import { TimeSignature } from '../types';

const midiDefaults = getMidiDefaultSymbols();

/**
 * Takes an offset of any form and returns a MIDI pulse offset. Supports:
 *  - numeric offset: not translated. Should be in terms of ppq
 *  - string offset: converted to a number and treated like a "numeric offset"
 *  - rhythmic: "1/8", "1/4", "1/2", etc
 *  - beat and rhythmic: "1:1/4", "2:1/8", etc.
 *  - bar and beat and rhythmic:  "1:1:1/4", "2:2:1/8", etc.
 * Note: this only calculates an offset relative to a single time-signature.
 */
export function midiOffsetToPulseCount(
	offset: number | string,
	timesignature: TimeSignature = midiDefaults.values.timesignature,
	ppq: number = midiDefaults.values.ppq
): number {
	if (typeof offset === 'number') {
		return offset;
	} else {
		const regex = /^(?:(\d+):)??(?:(\d)+:)??(?:(\d+)|(\d+)\s*\/\s*(\d+))$/;
		const match = offset.match(regex);
		if (match === null) {
			throw new Error(`could not match offset "${offset}" to spec ${regex}`);
		} else {
			let result = 0;
			const measure = match[1];
			const beat = match[2];
			const offset = match[3];
			const numerator = match[4];
			const denominator = match[5];
			const pulsesPerBeat = midiTimesignatureToPulsesPerBeat(timesignature, ppq);
			if (measure !== undefined) {
				result += Number(measure) * timesignature.numerator * pulsesPerBeat;
			}
			if (beat !== undefined) {
				result += Number(beat) * pulsesPerBeat;
			}
			if (offset) {
				result += Number(offset);
			} else {
				result += Math.round((Number(numerator) / Number(denominator)) * pulsesPerBeat);
			}
			return result;
		}
	}
}

export function midiTimesignatureToPulsesPerBeat(
	timesignature: TimeSignature,
	ppq: number
): number {
	return Math.round((ppq * 4) / timesignature.denominator);
}

export function midiTimesignatureToPulsesPerBar(
	timesignature: TimeSignature,
	ppq: number
): number {
	return midiTimesignatureToPulsesPerBeat(timesignature, ppq) * timesignature.numerator;
}
