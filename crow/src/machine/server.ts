/**
 * @license MIT (see project's LICENSE file)
 */

import { NotImplemented } from '@tiny/core';
import { IMatrix, IState } from '../types';

/**
 * todo: I want to be able to configure and run the machine from a browser.
 *  We will worry about that later.
 * todo: this is a harebrained design. Need to figure out how we want server
 *  to work. Which I think should just be requests to generate an entire
 *  song per request.
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

	public pause(): void {
		throw new NotImplemented();
	}

	public play(state: Readonly<IState>): void {
		throw new NotImplemented();
	}

	public resume(state: Readonly<IState>): void {
		throw new NotImplemented();
	}

	/***********************
	 * Private Interface
	 **********************/
}
