/**
 * @license MIT (see project's LICENSE file)
 */

import { FormulaType } from './core';

/**
 * This is how they would be typed in TS in our scripts. But our cell
 * literals and formulas are going to be strings. So we will not likely
 * be using this guys but want it noted somewhere.
 */
export type StateFunctionServer = (...args: any) => number | number[];

export interface IState {
	column: number;
	iteration: number;
	row: number;

	/**
	 * Cell methods and possibly user defined variables will be stored as text.
	 */
	[property: string]: number | number[] | FormulaType;
}
