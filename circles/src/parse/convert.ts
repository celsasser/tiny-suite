/**
 * @license MIT (see project's LICENSE file)
 */

import {
	isStringAnArray,
	MidiChannelType,
	midiOffsetToPulseCount,
	stringToFloat,
	stringToInteger,
	symbolsToIntegers,
	symbolToInteger,
	TimeSignature,
} from '@tiny/core';
import {
	CircleShape,
	ICircleProperties,
	IParsedInput,
	IProjectProperties,
} from '../types';
import { LexicalPatterns } from './lexical';
import {
	IInterimParsedInput,
	InterimCircleProperties,
	InterimProjectProperties,
} from './types';

/***********************
 * Public API
 **********************/
export function convertInput(parsedInput: Readonly<IInterimParsedInput>): IParsedInput {
	const project = convertProject(parsedInput.project);
	return {
		circles: parsedInput.circles.map(convertCircle.bind(null, project)),
		project,
	};
}

/***********************
 * Private Interface
 **********************/
function convertCircle(
	project: Readonly<IProjectProperties>,
	interimCircle: Readonly<InterimCircleProperties>
): ICircleProperties {
	const diameter = midiOffsetToPulseCount(interimCircle.diameter, project);
	const divisions = stringToInteger(interimCircle.divisions);
	const calculateOnOrOff = (value?: string): number | undefined => {
		if (value !== undefined) {
			if (value.endsWith('%')) {
				const percentage = stringToInteger(value.substring(0, value.length - 1)) / 100;
				return Math.round((percentage * diameter) / divisions);
			} else {
				return midiOffsetToPulseCount(value, project);
			}
		}
		return value;
	};

	return {
		...interimCircle,
		channel:
			interimCircle.channel !== undefined
				? stringToInteger<MidiChannelType>(interimCircle.channel)
				: undefined,
		diameter,
		divisions,
		max: stringToInteger(interimCircle.max),
		min: stringToInteger(interimCircle.min),
		notes: isStringAnArray(interimCircle.notes)
			? symbolsToIntegers(interimCircle.notes)
			: [symbolToInteger(interimCircle.notes)],
		off: calculateOnOrOff(interimCircle.off),
		on: calculateOnOrOff(interimCircle.on),
		phase: stringToFloat(interimCircle.phase),
		shape: interimCircle.shape as CircleShape,
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
