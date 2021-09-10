/**
 * @license MIT (see project's LICENSE file)
 */

/**
 * Processes first and then tests the predicate
 * @param predicate - determines how mamy times we iterate
 * @param process - this is the accumulator function and it's his value that is returned
 * @param initial - starting value
 */
export function doUntil<T>(
	predicate: (iteration: number) => boolean,
	process: (value: T, iteration: number) => T,
	initial: T
): T {
	let result: T = initial;
	let iteration = 0;
	do {
		result = process(result, iteration);
	} while (predicate(++iteration));
	return result;
}

/**
 * Processes as long as predicate returns a truthy value
 * @param predicate - determines how mamy times we iterate
 * @param process - this is the accumulator function and it's his value that is returned
 * @param initial - starting value
 */
export function doWhile<T>(
	predicate: (iteration: number) => boolean,
	process: (value: T, iteration: number) => T,
	initial: T
): T {
	let result: T = initial;
	for (let iteration = 0; predicate(iteration); iteration++) {
		result = process(result, iteration);
	}
	return result;
}
