/**
 * @license MIT (see project's LICENSE file)
 */

export class UnexpectedError extends Error {
	constructor(message?: string) {
		super(message ? message : 'unexpected error');
	}
}
