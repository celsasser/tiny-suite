/**
 * @license MIT (see project's LICENSE file)
 */

import { FormulaType, NumbersServerType } from './core';

export interface IState {
	column: number;
	iteration: number;
	row: number;

	/**
	 * A template for the following items:
	 * - All cells: may come in the form of literals or formulas
	 * - Our own number servers
	 * - Math functions and constants
	 * - and maybe user variables?
	 */
	[property: string]: number | FormulaType | NumbersServerType | Function;
}
