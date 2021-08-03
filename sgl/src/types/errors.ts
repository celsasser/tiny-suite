/**
 * @license MIT (see project's LICENSE file)
 */

import * as _ from 'lodash';

export class ParseError extends Error {
	constructor(buffer: string, location: string) {
		super(`attempt to parse ${buffer} failed. failure point = ${_.truncate(location)}`);
	}
}
