/**
 * @license MIT (see project's LICENSE file)
 */
import { FormulaType } from './primitives';

export interface IState {
	column: number;
	iteration: number;
	row: number;

	/**
	 * Cell methods and possibly user defined variables will be stored as text.
	 */
	[property: string]: number | number[] | FormulaType;
}
