/**
 * @license MIT (see project's LICENSE file)
 */

import { INumericRange } from '../types';

export function randomElementFromArray<T>(array: ReadonlyArray<T>): T {
	const index = randomIntegerFromRange({ min: 0, max: array.length - 1 });
	return array[index];
}

export function randomIntegerFromRange(irange: Readonly<INumericRange>): number {
	// note: Math.random() => [0, 1)
	return irange.min + Math.floor(Math.random() * (irange.max + 1 - irange.min));
}
