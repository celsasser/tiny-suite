/**
 * @license MIT (see project's LICENSE file)
 */

import { INumericRange } from '../types';
import { findChampionIndexByWeight } from './score';

export function randomElementFromArray<T>(array: ReadonlyArray<T>): T {
	const index = randomIntegerFromRange({ min: 0, max: array.length - 1 });
	return array[index];
}

export function randomIntegerFromRange(irange: Readonly<INumericRange>): number {
	// note: Math.random() => [0, 1)
	return irange.min + Math.floor(Math.random() * (irange.max + 1 - irange.min));
}

export function randomizeElements<T>(
	objects: ReadonlyArray<T>,
	weights?: ReadonlyArray<number>
): T[] {
	if (weights) {
		const objectsClone = objects.slice();
		const weightsClone = weights.slice();
		return objects.map(() => {
			const index = findChampionIndexByWeight(objectsClone, weightsClone);
			weightsClone.splice(index, 1);
			return objectsClone.splice(index, 1)[0];
		});
	} else {
		return objects
			.map((object) => ({
				object,
				order: Math.random(),
			}))
			.sort((a, b) => a.order - b.order)
			.map((a) => a.object);
	}
}
