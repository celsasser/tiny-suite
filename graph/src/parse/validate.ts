/**
 * @license MIT (see project's LICENSE file)
 */

import { IParsedInput } from '../types';

export function validate(parsed: Readonly<IParsedInput>): IParsedInput {
	if (parsed.project.start === undefined) {
		throw new Error('no starting edge specified');
	}
	if (parsed.graph === undefined || parsed.graph.isEmpty()) {
		console.warn(`no graph defined`);
	}
	return parsed as IParsedInput;
}
