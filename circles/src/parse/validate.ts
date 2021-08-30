/**
 * @license MIT (see project's LICENSE file)
 */

import { IParsedInput } from '../types';

export function validate(parsed: Readonly<IParsedInput>): IParsedInput {
	if (parsed.project.start === undefined) {
		throw new Error('no starting edge specified');
	}
	if (parsed.circles === undefined || parsed.circles.length === 0) {
		console.warn(`no circles defined`);
	}
	return parsed as IParsedInput;
}
