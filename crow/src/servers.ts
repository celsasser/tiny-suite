/**
 * @license MIT (see project's LICENSE file)
 *
 * Our collection of value servers
 */

import { INumericRange, randomIntegerFromRange, randomizeElements } from '@tiny/core';
import * as _ from 'lodash';
import {
	FunctionName,
	FunctionOption,
	IState,
	NumbersServerResultType,
	NumbersServerType,
} from './types';

/**
 * Serves the same value until the end of time
 */
const literalValueServer: NumbersServerType = function (
	state: Readonly<IState>,
	value: number | number[]
): NumbersServerResultType {
	return Array.isArray(value) ? value : [value];
};

/**
 * Cycles over and over through a list of from beginning to end
 */
export const cycleValueServer: NumbersServerType = function (
	state: Readonly<IState>,
	values: ReadonlyArray<number[]>
): NumbersServerResultType {
	return values[state.iteration % values.length];
};

/**
 * Inverts a passage around the `pivotPoint`
 * @param state
 * @param values
 * @param pivotPoint
 */
export const invertValueServer: NumbersServerType = function (
	state: Readonly<IState>,
	values: ReadonlyArray<number>,
	pivotPoint: number
): NumbersServerResultType {
	return values.map((value) => {
		if (value < pivotPoint) {
			return pivotPoint + pivotPoint - value;
		} else {
			return pivotPoint + value - pivotPoint;
		}
	});
};

/**
 * Note: ideally this would not be a value server but exist as a function
 * in our language that could be used to generate values for servers.
 * But our language doesn't support embedded functions.
 */
export const notValueServer: NumbersServerType = function (
	state: Readonly<IState>,
	exclude: ReadonlyArray<number>,
	candidates: ReadonlyArray<number>,
	options?: ReadonlyArray<FunctionOption>
): NumbersServerResultType {
	const champions = _.difference(candidates, exclude);
	// @eslint-ignore no-mixed-spaces-and-tabs
	return (options || []).includes(FunctionOption.Cycle)
		? cycleValueServer(
				state,
				champions.map((value) => [value])
		  )
		: literalValueServer(state, champions);
};

/**
 * Randomly returns arrays/chords with some configurability
 * @param state
 * @param values - bevy of values from which we may chose
 * @param icount - number of values that my be grouped
 * @param weights
 * @param options
 */
export const randomGroupingServer: NumbersServerType = function (
	state: Readonly<IState>,
	values: ReadonlyArray<number[]>,
	icount: Readonly<INumericRange>,
	weights?: ReadonlyArray<number>,
	options?: ReadonlyArray<FunctionOption>
): NumbersServerResultType {
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
		return cycleValueServer(state, sequence);
	} else {
		if (_.includes(options, FunctionOption.Reuse)) {
			const ordered = randomizeElements(values, weights);
			const count = randomIntegerFromRange(icount);
			return _(ordered).take(count).flattenDeep().value();
		} else {
			const ordered: number[][] = randomizeElements(values, weights);
			const count = randomIntegerFromRange(icount);
			return _.flattenDeep(ordered.splice(0, count));
		}
	}
};

/**
 * Randomly returns arrays/chords with some configurability
 */
export const randomSelectionServer: NumbersServerType = function (
	state: Readonly<IState>,
	values: ReadonlyArray<number[]>,
	weights?: ReadonlyArray<number>,
	options?: ReadonlyArray<FunctionOption>
): NumbersServerResultType {
	if (_.includes(options, FunctionOption.Cycle)) {
		if (_.includes(options, FunctionOption.Reuse)) {
			throw new Error(
				`"${FunctionName.RandomSelection}" with "cycle" does not support "reuse"`
			);
		}
		const sequence = randomizeElements(values, weights);
		return cycleValueServer(state, sequence);
	} else {
		if (_.includes(options, FunctionOption.Reuse)) {
			const irange = { min: 0, max: values.length - 1 };
			const index = randomIntegerFromRange(irange);
			return values[index];
		} else {
			const ordered: number[][] = randomizeElements(values, weights);
			return ordered.splice(0, 1)[0];
		}
	}
};
