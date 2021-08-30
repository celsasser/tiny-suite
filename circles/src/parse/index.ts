/**
 * @license MIT (see project's LICENSE file)
 */

import * as _ from 'lodash';
import { ParseTextBuffer } from '@tiny/core';
import {
	CirclePropertyName,
	ICircleProperties,
	IParsedInput,
	IProjectProperties,
	IPropertyAssignment,
	ProjectPropertyName,
} from '../types';
import { LexicalPatterns } from './lexical';
import { validate } from './validate';

/**
 * Picks the jumble apart and returns it or throws an error
 * @throws {Error}
 */
export function parseInput(input: string): any {
	const result: Partial<IParsedInput> = {
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
			result.project = value;
		} else if ((value = _getCircle(buffer))) {
			result.circles!.push(value);
		} else {
			throw new Error(`unrecognized input text "${_.truncate(buffer.remainder)}"`);
		}
	}
	return validate(result as IParsedInput);
}

function _getCircle(buffer: ParseTextBuffer): ICircleProperties | undefined {
	const matches = buffer.match(LexicalPatterns.CircleDeclaration);
	if (matches) {
		let propertyAssignment;
		const properties: Partial<ICircleProperties> = { name: matches[0] };
		while ((propertyAssignment = _getPropertyAssignment(buffer))) {
			// we really don't care if the user adds properties but our concern is that
			// they may have misspelled a known property
			if (Object.values<string>(CirclePropertyName).includes(propertyAssignment.name)) {
				// @ts-expect-error: he doesn't trust me (with good reason)
				properties[propertyAssignment.name] = propertyAssignment.rvalue;
			} else {
				throw new Error(
					`property "${propertyAssignment.name}" does not exist on "${properties.name!}"`
				);
			}
		}
		return properties as ICircleProperties;
	}
	return undefined;
}

function _getProject(buffer: ParseTextBuffer): IProjectProperties | undefined {
	const matches = buffer.match(LexicalPatterns.ProjectDeclaration);
	if (matches) {
		let propertyAssignment;
		const properties: Partial<IProjectProperties> = {};
		while ((propertyAssignment = _getPropertyAssignment(buffer))) {
			// we really don't care if the user adds properties but our concern is that
			// they may have misspelled a known property
			if (Object.values<string>(ProjectPropertyName).includes(propertyAssignment.name)) {
				// @ts-expect-error: he doesn't trust me (with good reason)
				properties[propertyAssignment.name] = propertyAssignment.rvalue;
			} else {
				throw new Error(
					`property "${propertyAssignment.name}" does not exist on "project:"`
				);
			}
		}
		return properties as IProjectProperties;
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
