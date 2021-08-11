/**
 * @license MIT (see project's LICENSE file)
 *
 * Our collection of value servers
 */

import * as _ from 'lodash';
import { randomizeElements, randomIntegerFromRange, INumericRange } from '@tiny/core';
import { FunctionName, FunctionOption, IState, NumbersServer } from './types';

/**
 * Serves the same value until the end of time
 * @param state
 * @param value
 */
export function createLiteralServer(
	state: Readonly<IState>,
	value: number | number[]
): NumbersServer {
	const result = Array.isArray(value) ? value : [value];
	return () => result;
}

/**
 * Cycles over and over through a list of from beginning to end
 * @param values
 */
export function createCycleServer(
	state: Readonly<IState>,
	values: ReadonlyArray<number[]>
): NumbersServer {
	let index = 0;
	return (): number[] => {
		return values[index++ % values.length];
	};
}

/**
 * Note: ideally this would not be a value server but exist as a function
 * in our language that could be used to generate values for servers.
 * But our language doesn't support embedded functions.
 * @param exclude
 * @param candidates
 * @param options
 */
export function createNotServer(
	state: Readonly<IState>,
	exclude: ReadonlyArray<number>,
	candidates: ReadonlyArray<number>,
	options?: ReadonlyArray<FunctionOption>
): NumbersServer {
	const champions = _.difference(candidates, exclude);
	return (options || []).includes(FunctionOption.Cycle)
		? createCycleServer(champions.map((value) => [value]))
		: createLiteralServer(champions);
}

/**
 * Randomly returns arrays/chords with some configurability
 * @param values - bevy of values from which we may chose
 * @param icount - number of values that my be grouped
 * @param weights
 * @param options
 */
export function createRandomGroupingServer(
	state: Readonly<IState>,
	values: ReadonlyArray<number[]>,
	icount: Readonly<INumericRange>,
	weights?: ReadonlyArray<number>,
	options?: ReadonlyArray<FunctionOption>
): NumbersServer {
	if (_.includes(options, FunctionOption.Cycle)) {
		if (_.includes(options, FunctionOption.Reuse)) {
			throw new Error(
				`"${FunctionName.RandomGrouping}" with "cycle" does not support "reuse"`
			);
		}
		const sequence: number[][] = [];
		const ordered = randomizeElements(values, weights);
		while (ordered.length) {
			const count = randomIntegerFromRange(icount);
			sequence.push(_.flattenDeep(ordered.splice(0, count)));
		}
		return createCycleServer(sequence);
	} else {
		if (_.includes(options, FunctionOption.Reuse)) {
			return (): number[] => {
				const ordered = randomizeElements(values, weights);
				const count = randomIntegerFromRange(icount);
				return _(ordered).take(count).flattenDeep().value();
			};
		} else {
			let ordered: number[][] = [];
			return (): number[] => {
				if (ordered.length === 0) {
					ordered = randomizeElements(values, weights);
				}
				const count = randomIntegerFromRange(icount);
				return _.flattenDeep(ordered.splice(0, count));
			};
		}
	}
}

/**
 * Randomly returns arrays/chords with some configurability
 * @param values
 * @param weights
 * @param options
 */
export function createRandomSelectionServer(
	state: Readonly<IState>,
	values: ReadonlyArray<number[]>,
	weights?: ReadonlyArray<number>,
	options?: ReadonlyArray<FunctionOption>
): NumbersServer {
	if (_.includes(options, FunctionOption.Cycle)) {
		if (_.includes(options, FunctionOption.Reuse)) {
			throw new Error(
				`"${FunctionName.RandomSelection}" with "cycle" does not support "reuse"`
			);
		}
		const sequence = randomizeElements(values, weights);
		return createCycleServer(sequence);
	} else {
		if (_.includes(options, FunctionOption.Reuse)) {
			const irange = { min: 0, max: values.length - 1 };
			return (): number[] => {
				const index = randomIntegerFromRange(irange);
				return values[index];
			};
		} else {
			let ordered: number[][] = [];
			return (): number[] => {
				if (ordered.length === 0) {
					ordered = randomizeElements(values, weights);
				}
				return ordered.splice(0, 1)[0];
			};
		}
	}
}
