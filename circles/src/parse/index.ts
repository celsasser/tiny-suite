/**
 * @license MIT (see project's LICENSE file)
 */

import { getMidiDefaultSymbols, ParseTextBuffer } from '@tiny/core';
import * as _ from 'lodash';
import {
	CirclePropertyName,
	CircleShape,
	getAllVocabularyProperties,
	IParsedInput,
	IPropertyAssignment,
	ProjectPropertyName,
} from '../types';
import { convert } from './convert';
import { LexicalPatterns } from './lexical';
import {
	IInterimParsedInput,
	InterimCircleProperties,
	InterimProjectProperties,
} from './types';
import { validate } from './validate';

/**
 * Picks the jumble apart and returns it or throws an error
 * @throws {Error}
 */
export function parseInput(input: string): IParsedInput {
	const interim: Partial<IInterimParsedInput> = {
		circles: [],
	};
	const buffer = new ParseTextBuffer(input);

	/**
	 * Removes meaningless stuff and then checks on where we are
	 */
	const isEnd = (): boolean => {
		buffer.match(LexicalPatterns.CommentsAndSpace);
		return buffer.isEnd();
	};
	while (!isEnd()) {
		let value: any;
		if ((value = _getProject(buffer))) {
			interim.project = value;
		} else if ((value = _getCircle(buffer))) {
			interim.circles!.push(value);
		} else {
			throw new Error(`unrecognized input text "${_.truncate(buffer.remainder)}"`);
		}
	}
	const validated = validate(interim);
	return convert(validated);
}

function _getCircle(buffer: ParseTextBuffer): InterimCircleProperties | undefined {
	const matches = buffer.match(LexicalPatterns.CircleDeclaration);
	if (matches) {
		let propertyAssignment;
		const properties: Partial<InterimCircleProperties> = {
			max: '127',
			min: '0',
			phase: '0',
			name: matches[0],
			shape: CircleShape.LowToHigh,
		};
		const supportedProperties = getAllVocabularyProperties(CirclePropertyName);
		while ((propertyAssignment = _getPropertyAssignment(buffer))) {
			// we really don't care if the user adds properties but our concern is that they
			// may have misspelled a known property
			if (supportedProperties.includes(propertyAssignment.name)) {
				// @ts-expect-error: he doesn't trust me (with good reason)
				properties[propertyAssignment.name] = propertyAssignment.rvalue;
			} else {
				throw new Error(
					`property "${propertyAssignment.name}" does not exist on "${properties.name!}"`
				);
			}
		}
		return properties as InterimCircleProperties;
	}
	return undefined;
}

function _getProject(buffer: ParseTextBuffer): InterimProjectProperties | undefined {
	const matches = buffer.match(LexicalPatterns.ProjectDeclaration);
	if (matches) {
		let propertyAssignment;
		const defaultMidiValues = getMidiDefaultSymbols();
		const properties: Partial<InterimProjectProperties> = {
			ppq: defaultMidiValues.values.ppq,
			timesignature: `${defaultMidiValues.values.timesignature.numerator}/${defaultMidiValues.values.timesignature.denominator}`,
		};
		const supportedProperties = getAllVocabularyProperties(ProjectPropertyName);
		while ((propertyAssignment = _getPropertyAssignment(buffer))) {
			if (supportedProperties.includes(propertyAssignment.name)) {
				// @ts-expect-error: he doesn't trust me (with good reason)
				properties[propertyAssignment.name] = propertyAssignment.rvalue;
			} else {
				throw new Error(
					`property "${propertyAssignment.name}" does not exist on "project:"`
				);
			}
		}
		return properties as InterimProjectProperties;
	}
	return undefined;
}

/**
 * Very low investment for now
 * @param buffer
 */
function _getPropertyAssignment(
	buffer: ParseTextBuffer
): IPropertyAssignment | undefined {
	const match = buffer.match(LexicalPatterns.PropertyAssignment);
	/* eslint-disable no-mixed-spaces-and-tabs */
	return match
		? {
				name: match[0],
				rvalue: match[1],
		  }
		: undefined;
}
