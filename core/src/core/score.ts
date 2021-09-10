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
	return objects[findChampionIndexByWeight(objects, weights)];
}

/**
 * Returns a winner with probability based on `weights`
 * `objects` and `weights` must be of the same length.
 * @param objects - the contestants
 * @param weights - their weights
 * @returns instance of T if `objects` is not empty otherwise `undefined`
 */
export function findChampionIndexByWeight<T>(
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
