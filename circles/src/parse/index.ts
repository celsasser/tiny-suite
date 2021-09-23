/**
 * @license MIT (see project's LICENSE file)
 */

import {
	getAllVocabularyProperties,
	getIniHeadings,
	getIniProjectHeading,
	getIniPropertyAssignment,
	getMidiDefaultSymbols,
	LexicalPatterns,
	ParseTextBuffer,
} from '@tiny/core';
import * as _ from 'lodash';
import {
	CircleFlow,
	CirclePropertyName,
	CircleShape,
	IParsedInput,
	ProjectPropertyName,
} from '../types';
import { convertInput } from './convert';
import {
	IInterimParsedInput,
	InterimCircleProperties,
	InterimProjectProperties,
} from './types';
import { validateInterimInput } from './validate';

/**
 * Picks the jumble apart and returns it or throws an error
 * @throws {Error}
 */
export function parseInput(input: string): IParsedInput {
	const interimInput: Partial<IInterimParsedInput> = {};
	const circleMap: { [name: string]: InterimCircleProperties } = {};
	const parseBuffer = new ParseTextBuffer(input);

	/**
	 * Removes meaningless stuff and then checks on where we are
	 */
	const isEnd = (): boolean => {
		parseBuffer.match(LexicalPatterns.CommentsAndSpace);
		return parseBuffer.isEnd();
	};
	while (!isEnd()) {
		let value: any;
		if ((value = _getProject(parseBuffer))) {
			interimInput.project = value;
		} else if ((value = _getCircles(parseBuffer))) {
			value.forEach((circle: InterimCircleProperties) => {
				if (circleMap.hasOwnProperty(circle.name)) {
					circleMap[circle.name] = {
						...circleMap[circle.name],
						...circle,
					};
				} else {
					circleMap[circle.name] = circle;
				}
			});
		} else {
			throw new Error(`unrecognized input text "${_.truncate(parseBuffer.remainder)}"`);
		}
	}
	interimInput.circles = _.sortBy(Object.values(circleMap), 'name');
	const validated = validateInterimInput(interimInput);
	return convertInput(validated);
}

function _getCircles(buffer: ParseTextBuffer): InterimCircleProperties[] | undefined {
	const names = getIniHeadings(buffer);
	if (names) {
		let propertyAssignment;
		const properties: Partial<InterimCircleProperties> = {
			flow: CircleFlow.LowToHigh,
			// we set the default min to 1 'cause 0 is treated as note off
			max: '127',
			min: '1',
			phase: '0',
			shape: CircleShape.Sine,
		};
		const supportedProperties = getAllVocabularyProperties(CirclePropertyName);
		while ((propertyAssignment = getIniPropertyAssignment(buffer))) {
			// we really don't care if the user adds properties but our concern is that they
			// may have misspelled a known property
			if (supportedProperties.includes(propertyAssignment.key)) {
				// @ts-expect-error: he doesn't trust me
				properties[propertyAssignment.key] = propertyAssignment.value;
			} else {
				throw new Error(
					`property "${propertyAssignment.key}" does not exist on "${properties.name!}"`
				);
			}
		}
		return names.map(
			(name) =>
				({
					...properties,
					...{ name },
				} as InterimCircleProperties)
		);
	}
	return undefined;
}

function _getProject(buffer: ParseTextBuffer): InterimProjectProperties | undefined {
	const match = getIniProjectHeading(buffer);
	if (match) {
		let propertyAssignment;
		const defaultMidiValues = getMidiDefaultSymbols();
		const properties: Partial<InterimProjectProperties> = {
			ppq: defaultMidiValues.values.ppq,
			timesignature: `${defaultMidiValues.values.timesignature.numerator}/${defaultMidiValues.values.timesignature.denominator}`,
		};
		const supportedProperties = getAllVocabularyProperties(ProjectPropertyName);
		while ((propertyAssignment = getIniPropertyAssignment(buffer))) {
			if (supportedProperties.includes(propertyAssignment.key)) {
				// @ts-expect-error: he doesn't trust me (with good reason)
				properties[propertyAssignment.key] = propertyAssignment.value;
			} else {
				throw new Error(
					`property "${propertyAssignment.key}" does not exist on "project:"`
				);
			}
		}
		return properties as InterimProjectProperties;
	}
	return undefined;
}
