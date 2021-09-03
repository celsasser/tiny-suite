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
import {
	CircleShape,
	ICircleProperties,
	IParsedInput,
	IProjectProperties,
} from '../types';
import { LexicalPatterns } from './lexical';
import { IInterimParsedInput, InterimProjectProperties } from './types';

export function convert(parsed: Readonly<IInterimParsedInput>): IParsedInput {
	const project = convertProject(parsed.project);
	return {
		circles: parsed.circles.map(
			(interimCircle): ICircleProperties => ({
				...interimCircle,
				channel:
					interimCircle.channel !== undefined
						? stringToInteger<MidiChannelType>(interimCircle.channel)
						: undefined,
				diameter: midiOffsetToPulseCount(interimCircle.diameter, project),
				divisions: stringToInteger(interimCircle.divisions),
				max: stringToInteger(interimCircle.max),
				min: stringToInteger(interimCircle.min),
				notes: isStringAnArray(interimCircle.notes)
					? stringToIntegers(interimCircle.notes)
					: [stringToInteger(interimCircle.notes)],
				off:
					interimCircle.off !== undefined
						? midiOffsetToPulseCount(interimCircle.off, project)
						: undefined,
				on:
					interimCircle.on !== undefined
						? midiOffsetToPulseCount(interimCircle.on, project)
						: undefined,
				phase: Number.parseFloat(interimCircle.phase),
				shape: interimCircle.shape as CircleShape,
			})
		),
		project,
	};
}

function convertProject(
	interimProject: Readonly<InterimProjectProperties>
): IProjectProperties {
	const ppq = stringToInteger(interimProject.ppq!);
	const timesignature = parseTimesignature(interimProject.timesignature!);
	const length = midiOffsetToPulseCount(interimProject.length, { ppq, timesignature });
	return {
		...interimProject,
		length,
		ppq,
		timesignature,
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
