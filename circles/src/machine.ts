/**
 * @license MIT (see project's LICENSE file)
 */

import { IChannel } from '@tiny/core';
import { ICircleProperties, IParsedInput } from './types';

/**
 * Processes parsed input and traverses the graph and generates a channel stream
 */
export class Machine {
	private readonly _input: Readonly<IParsedInput>;

	constructor(input: Readonly<IParsedInput>) {
		this._input = input;
	}

	/***********************
	 * Public Interface
	 **********************/
	public run(): IChannel[] {
		const channels: IChannel[] = this._input.circles.map(
			this._circleToChannel.bind(this)
		);
		return channels;
	}

	/***********************
	 * Private Interface
	 **********************/
	private _circleToChannel(circle: Readonly<ICircleProperties>): IChannel {}
}
