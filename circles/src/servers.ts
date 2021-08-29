/**
 * @license MIT (see project's LICENSE file)
 *
 * Our collection of value servers
 */

import { NumbersServer } from './types';

/**
 * Cycles over and over through a list of from beginning to end
 * @param values
 */
export function createCycleServer(values: ReadonlyArray<number[]>): NumbersServer {
	let index = 0;
	return (): number[] => {
		return values[index++ % values.length];
	};
}
