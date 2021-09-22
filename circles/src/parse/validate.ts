/**
 * @license MIT (see project's LICENSE file)
 */

import { getRequiredVocabularyProperties } from '@tiny/core';
import * as _ from 'lodash';
import { CirclePropertyName, ICircleProperties, ProjectPropertyName } from '../types';
import {
	IInterimParsedInput,
	InterimCircleProperties,
	InterimProjectProperties,
} from './types';

/***********************
 * Public Interface
 **********************/
export function validateInterimInput(
	parsed: Readonly<Partial<IInterimParsedInput>>
): Readonly<IInterimParsedInput> {
	_validateProject(parsed.project!);
	if (parsed.circles === undefined || parsed.circles.length === 0) {
		console.warn(`no circles defined`);
	} else {
		parsed.circles.forEach(_validateCircle);
	}
	return parsed as IInterimParsedInput;
}

/**
 * Validates circle data but not MIDI data. We have delegate all of our MIDI concerns
 * to our core `midi` module.
 * @param circle
 */
export function validateConvertedCircle(circle: Readonly<ICircleProperties>): void {
	if (circle.diameter <= 0) {
		throw new Error(
			`circle "${circle.name}" has a calculated diameter of ${circle.diameter}`
		);
	}
}

/***********************
 * Private Interface
 **********************/
function _validateCircle(circle: Readonly<InterimCircleProperties>): void {
	const missing = _.difference(
		getRequiredVocabularyProperties(CirclePropertyName),
		Object.keys(circle)
	);
	if (missing.length > 0) {
		throw new Error(`circle "${circle.name}" missing required values for ${missing}`);
	}
}

function _validateProject(project: Readonly<InterimProjectProperties>): void {
	const missing = _.difference(
		getRequiredVocabularyProperties(ProjectPropertyName),
		Object.keys(project)
	);
	if (missing.length > 0) {
		throw new Error(`missing required project values for ${missing}`);
	}
}
