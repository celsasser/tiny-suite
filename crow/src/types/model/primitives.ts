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
 * This is how they are typed locally. The state will be included by us.
 * The rest of the args are defined by the function itself.
 */
export type NumbersServerType = (
	state: Readonly<IState>,
	...args: any
) => NumbersServerResultType;
export type NumbersServerResultType = number[];
