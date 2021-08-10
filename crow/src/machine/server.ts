/**
 * @license MIT (see project's LICENSE file)
 */

import { IMatrix, IState } from '../types';

/**
 * todo: I want to be able to configure and run the machine from a browser.
 *  We will worry about that later.
 */
export class Machine {
	// @ts-expect-error: we'll get to it
	private _matrix: Readonly<IMatrix>;

	/***********************
	 * Public Interface
	 **********************/
	public constructor(matrix: Readonly<IMatrix>) {
		this._matrix = matrix;
	}

	public pause(): void {}

	public play(state: Readonly<IState>): void {}

	public resume(state: Readonly<IState>): void {}

	/***********************
	 * Private Interface
	 **********************/
}
