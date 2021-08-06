/**
 * @license MIT (see project's LICENSE file)
 */

import { Matrix } from './model';
import { IMatrix } from './types';
import { IState } from './types/model/state';

/**
 * I want to be able to configure and run the machine from a browser.
 * We will worry about that later.
 */
export class Machine {
	private _matrix: Readonly<IMatrix>;

	/***********************
	 * Public Interface
	 **********************/
	public constructor(matrix: Readonly<IMatrix>) {
		Matrix;
		this._matrix = matrix;
	}

	public pause(): void {}

	public play(state: Readonly<IState>): void {}

	public resume(state: Readonly<IState>): void {}

	/***********************
	 * Private Interface
	 **********************/
}
