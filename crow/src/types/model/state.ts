/**
 * @license MIT (see project's LICENSE file)
 */

export interface IState {
	column: number;
	iteration: number;
	row: number;

	/**
	 * User defined variables will be in here as well.
	 */
	[property: string]: number | string;
}
