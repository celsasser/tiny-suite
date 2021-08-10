/**
 * @license MIT (see project's LICENSE file)
 */

import { IChannel } from '@tiny/core';
import { IStaticInput } from '../types';

/**
 * todo: I want to be able to configure and run the machine from a browser.
 *  We will worry about that later.
 */
export class StaticMachine {
	// @ts-expect-error: we'll get to it
	private _input: Readonly<IStaticInput>;

	/***********************
	 * Public Interface
	 **********************/
	public constructor(input: Readonly<IStaticInput>) {
		this._input = input;
	}

	public run(): IChannel[] {}

	/***********************
	 * Private Interface
	 **********************/
}
