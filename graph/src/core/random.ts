/**
 * @license MIT (see project's LICENSE file)
 */

import * as _ from 'lodash';
import { IWeighted } from '../types';

/**
 * Returns a winner with probability based on `weights`
 * `objects` and `weights` must be of the same length.
 * @param objects - the contestants
 * @param weights - their weights
 * @returns instance of T if `objects` is not empty otherwise `undefined`
 */
export function findChampionByWeight<T>(
	objects: ReadonlyArray<T>,
	weights: ReadonlyArray<number>
): T | undefined {
	return objects[_findChampionIndexByWeight(objects, weights)];
}

/**
 * Thin wrapper around `findChampionByWeight`
 * @param objects
 * @returns instance of T if `objects` is not empty otherwise `undefined`
 */
export function findChampionByInterface<T extends IWeighted>(
	objects: ReadonlyArray<T>
): T | undefined {
	return findChampionByWeight(
		objects,
		objects.map((weighted) => weighted.weight)
	);
}

export function randomizeElements<T>(
	objects: ReadonlyArray<T>,
	weights?: ReadonlyArray<number>
): T[] {
	if (weights) {
		const objectsClone = objects.slice();
		const weightsClone = weights.slice();
		return objects.map(() => {
			const index = _findChampionIndexByWeight(objectsClone, weightsClone);
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

/***********************
 * Private Interface
 **********************/
/**
 * Returns a winner with probability based on `weights`
 * `objects` and `weights` must be of the same length.
 * @param objects - the contestants
 * @param weights - their weights
 * @returns instance of T if `objects` is not empty otherwise `undefined`
 */
function _findChampionIndexByWeight<T>(
	objects: ReadonlyArray<T>,
	weights: ReadonlyArray<number>
): number {
	let accumulated = _.sum(weights);
	const target = Math.random() * accumulated;
	for (let index = weights.length - 1; index > 0; index--) {
		accumulated -= weights[index % weights.length];
		if (target >= accumulated) {
			return index;
		}
	}
	return 0;
}
