/**
 * @license MIT (see project's LICENSE file)
 */

import { IChannel } from '@tiny/core';
import { CliOptions, IStaticInput } from '../types';

/**
 * todo: I want to be able to configure and run the machine from a browser.
 *  We will worry about that later.
 */
export class StaticMachine {
	// @ts-expect-error: we'll get to it
	private _input: Readonly<IStaticInput>;
	private _options: Readonly<CliOptions>;

	/***********************
	 * Public Interface
	 **********************/
	public constructor(input: Readonly<IStaticInput>, options: Readonly<CliOptions>) {
		this._input = input;
		this._options = options;
	}

	public run(): IChannel[] {
		const matrix = this._processMatrix();
		this._applyRowHeaders(matrix);
		this._applyColumnHeaders(matrix);
		return this._matrixToChannels(matrix);
	}

	/***********************
	 * Private Interface
	 **********************/
	private _applyColumnHeaders(matrix: any): void {}

	private _applyRowHeaders(matrix: any): void {}

	private _matrixToChannels(matrix: any): IChannel[] {}

	private _processMatrix(): any {}
}
