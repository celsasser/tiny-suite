/**
 * @license MIT (see project's LICENSE file)
 */

import { getRequiredVocabularyProperties } from '@tiny/core';
import * as _ from 'lodash';
import { CirclePropertyName, ProjectPropertyName } from '../types';
import { IInterimParsedInput } from './types';

export function validateInput(
	parsed: Readonly<Partial<IInterimParsedInput>>
): Readonly<IInterimParsedInput> {
	let values: string[];
	if (
		(values = _.difference(
			getRequiredVocabularyProperties(ProjectPropertyName),
			Object.keys(parsed.project!)
		)).length > 0
	) {
		throw new Error(`missing required project values for ${values}`);
	}
	if (parsed.circles === undefined || parsed.circles.length === 0) {
		console.warn(`no circles defined`);
	} else {
		parsed.circles.forEach((circle) => {
			if (
				(values = _.difference(
					getRequiredVocabularyProperties(CirclePropertyName),
					Object.keys(circle)
				)).length > 0
			) {
				throw new Error(`circle "${circle.name}" missing required values for ${values}`);
			}
		});
	}
	return parsed as IInterimParsedInput;
}
