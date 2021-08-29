/**
 * @license MIT (see project's LICENSE file)
 */

import { IChannel } from '@tiny/core';
import * as _ from 'lodash';
import { IParsedInput } from './types';

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
		let steps = 0;
		const channels: IChannel[] = [];
		channels.forEach(this._cleanChannel.bind(this));
		return channels;
	}

	/***********************
	 * Private Interface
	 **********************/
	private _cleanChannel(channel: IChannel): void {
		// remove note duplicates
		channel.notes = channel.notes.map((value: number | number[]): number[] => {
			return _.chain<number>(value as number[])
				.sort()
				.sortedUniq()
				.value();
		});
	}
}
