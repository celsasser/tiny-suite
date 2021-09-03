/**
 * @license MIT (see project's LICENSE file)
 *
 * As noted in `types/project.ts` we are going to make the assumption that
 * all parsed types are not cast and are in their raw string state.
 */

import { IChannel } from '@tiny/core';
import { CircleShape, ICircleProperties, IParsedInput } from './types';

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
	private _circleToChannel(circle: Readonly<ICircleProperties>): IChannel {
		const result: IChannel = {
			durations: [],
			notes: [],
			velocities: [],
		};
		const noteLength = circle.diameter / circle.divisions;
		const noteDuration = Math.floor(
			circle.off !== undefined ? noteLength - circle.off : circle.on ?? noteLength
		);
		const startingPhase =
			Math.PI * 2 * circle.phase + (circle.shape === CircleShape.HighToLow ? Math.PI : 0);
		const caclulateVelocity = (ppq: number): number => {
			// convert ppq to the position in a cycle (in radians)
			const offset = (Math.PI * 2 * ppq) / circle.diameter;
			const normalized = (Math.cos(startingPhase + offset) + 1) / 2;
			return Math.round(circle.min + (circle.max - circle.min) * normalized);
		};

		for (
			let index = 1, ppq = 0, rested = 0;
			ppq < this._input.project.length;
			index++, ppq += noteLength
		) {
			result.durations!.push(noteDuration);
			result.notes.push(circle.notes);
			result.velocities!.push(caclulateVelocity(ppq));
			// see whether we need to introduce some rest time to accommodate for:
			//  a. noteLength != noteDuration
			//  b. rational `noteLength`
			const rest = Math.floor(noteLength * index - noteDuration * index - rested);
			if (rest > 0) {
				result.durations!.push(rest);
				result.notes.push([]);
				result.velocities!.push(0);
				rested += rest;
			}
		}
		return result;
	}
}
