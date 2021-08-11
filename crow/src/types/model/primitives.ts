/**
 * @license MIT (see project's LICENSE file)
 */

import { IState } from './state';

/**
 * Our cell values will always be string values that will be evaluated as JS.
 */
export type FormulaType = string;
export type KeyboardShortcutType = string[][];
/**
 * This is how they are typed locally.
 */
export type StateFunctionServer = (
	state: Readonly<IState>,
	...args: any
) => number | number[];
