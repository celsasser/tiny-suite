/**
 * @license MIT (see project's LICENSE file)
 */

import { getMidiDefaultSymbols } from '../resource';
import { TimeSignature } from '../types';

const midiDefaults = getMidiDefaultSymbols();
const meterRegex = /^(?:(\d+):)??(?:(\d)+:)??(?:(\d+)|(\d+)\s*\/\s*(\d+))$/;

/**
 * Takes an offset in one of many forms and returns a PPQ offset. Supports:
 *  - numeric offset: not translated. Should be in terms of ppq. For example, 480, "480"
 *  - rhythmic: For example, "1/8", "1/4", "1/2", etc
 *  - beat and rhythmic: For example, "1:1/4", "2:1/8", etc.
 *  - measure, beat and rhythmic:  For example, "1:1:1/4", "2:2:1/8", etc.
 *  - measure, beat and offset:  For example, "1:1:60", "2:2:30", etc.
 *
 * Discussion: what is 0 in terms of B:R and M:B:R in an offset? By default we are going
 * to use classic notation indexing which is 1 based. For example, "Measure 1, beat 1" =
 * 1:1:0. BUT we allow for the caller to specify a `relativeTo` offset. If you should
 * like to treat something else as 0 then you may set `relativeTo` to any value you want
 * to use as the "origin"
 * @param offset - value for which you want a PPQ
 * @param ppq - the formal PPQ
 * @param relativeTo - location from. We set it to 0 for speed. Assuming the indexing
 *    discussed above this is equivalent to `1:1:0`
 * @param timesignature
 */
export function midiOffsetToPulseCount(
	offset: number | string,
	{
		ppq = midiDefaults.values.ppq,
		relativeTo = 0,
		timesignature = midiDefaults.values.timesignature,
	}: {
		ppq?: number;
		relativeTo?: number | string;
		timesignature?: TimeSignature;
	} = {}
): number {
	const relativeToOffset =
		relativeTo === 0
			? 0
			: midiOffsetToPulseCount(relativeTo, {
					ppq,
					relativeTo: 0,
					timesignature,
			  });
	if (typeof offset === 'number') {
		return offset - relativeToOffset;
	} else {
		const match = offset.match(meterRegex);
		if (match === null) {
			throw new Error(`could not match offset "${offset}" to spec ${meterRegex}`);
		} else {
			let result = 0;
			const [, measure, beat, offset, numerator, denominator] = match;
			const pulsesPerBeat = midiTimesignatureToPulsesPerBeat(timesignature, ppq);
			if (measure !== undefined) {
				result += (Number(measure) - 1) * timesignature.numerator * pulsesPerBeat;
			}
			if (beat !== undefined) {
				result += (Number(beat) - 1) * pulsesPerBeat;
			}
			if (offset) {
				result += Number(offset);
			} else {
				result += Math.round(
					(Number(numerator) / Number(denominator)) *
						timesignature.denominator *
						pulsesPerBeat
				);
			}
			return result - relativeToOffset;
		}
	}
}

/**
 * Takes duration in one of many forms and returns a PPQ offset. See
 * `midiOffsetToPulseCount`'s documentation. This is _nearly_ identical, but here we do
 * embrace 0 counts for bars, measures and beats (of course).
 * @param offset - value for which you want a PPQ
 * @param ppq - the formal PPQ
 * @param timesignature
 */
export function midiDurationToPulseCount(
	offset: number | string,
	{
		ppq = midiDefaults.values.ppq,
		timesignature = midiDefaults.values.timesignature,
	}: {
		ppq?: number;
		timesignature?: TimeSignature;
	} = {}
): number {
	if (typeof offset === 'number') {
		return offset;
	} else {
		const match = offset.match(meterRegex);
		if (match === null) {
			throw new Error(`could not match offset "${offset}" to spec ${meterRegex}`);
		} else {
			let result = 0;
			const [, measure, beat, offset, numerator, denominator] = match;
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
				result += Math.round(
					(Number(numerator) / Number(denominator)) *
						timesignature.denominator *
						pulsesPerBeat
				);
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
