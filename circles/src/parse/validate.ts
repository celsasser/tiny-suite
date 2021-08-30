/**
 * @license MIT (see project's LICENSE file)
 */

import * as _ from 'lodash';
import {
	CirclePropertyName,
	getRequiredVocabularyProperties,
	IParsedInput,
	ProjectPropertyName,
} from '../types';

export function validate(parsed: Readonly<IParsedInput>): IParsedInput {
	let values: string[];
	if (
		(values = _.difference(
			getRequiredVocabularyProperties(ProjectPropertyName),
			Object.values(parsed.project)
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
					Object.values(circle)
				)).length > 0
			) {
				throw new Error(`circle "${circle.name}" missing required values for ${values}`);
			}
		});
	}
	return parsed as IParsedInput;
}
