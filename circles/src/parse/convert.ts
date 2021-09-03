/**
 * @license MIT (see project's LICENSE file)
 */

import {
	midiOffsetToPulseCount,
	isStringAnArray,
	stringToInteger,
	stringToIntegers,
	MidiChannelType,
	TimeSignature,
} from '@tiny/core';
import { CircleShape, ICircleProperties, IParsedInput } from '../types';
import { LexicalPatterns } from './lexical';
import { IInterimParsedInput } from './types';

export function convert(parsed: Readonly<IInterimParsedInput>): IParsedInput {
	return {
		circles: parsed.circles.map(
			(interimCircle): ICircleProperties => ({
				...interimCircle,
				channel:
					interimCircle.channel !== undefined
						? stringToInteger<MidiChannelType>(interimCircle.channel)
						: undefined,
				diameter: midiOffsetToPulseCount(interimCircle.diameter),
				divisions: stringToInteger(interimCircle.divisions),
				max: midiOffsetToPulseCount(interimCircle.max),
				min: midiOffsetToPulseCount(interimCircle.min),
				notes: isStringAnArray(interimCircle.notes)
					? stringToIntegers(interimCircle.notes)
					: [stringToInteger(interimCircle.notes)],
				off:
					interimCircle.off !== undefined
						? midiOffsetToPulseCount(interimCircle.off)
						: undefined,
				on:
					interimCircle.on !== undefined
						? midiOffsetToPulseCount(interimCircle.on)
						: undefined,
				phase: Number.parseFloat(interimCircle.phase),
				shape: interimCircle.shape as CircleShape,
			})
		),
		project: {
			...parsed.project,
			length: midiOffsetToPulseCount(parsed.project.length),
			ppq: stringToInteger(parsed.project.ppq!),
			timesignature: parseTimesignature(parsed.project.timesignature!),
		},
	};
}

function parseTimesignature(value: string): TimeSignature {
	const parsed = value.match(LexicalPatterns.TimeSignature);
	if (parsed === null) {
		throw new Error('unable to translate value to a time-signature');
	}
	return {
		denominator: Number.parseInt(parsed[2]),
		numerator: Number.parseInt(parsed[1]),
	};
}
