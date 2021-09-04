/**
 * @license MIT (see project's LICENSE file)
 *
 * As noted in `types/project.ts` we are going to make the assumption that
 * all parsed types are not cast and are in their raw string state.
 */

import { IChannel } from '@tiny/core';
import {
	CircleShape,
	ICircleProperties,
	IParsedInput,
	isShapeHighToLow,
	isShapeOnToOff,
} from './types';

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
		const shapeIsHighToLow = isShapeHighToLow(circle.shape);
		const shapeIsOnToOff = isShapeOnToOff(circle.shape);
		const noteLength = circle.diameter / circle.divisions;
		const noteOnDuration = Math.floor(
			circle.off !== undefined ? noteLength - circle.off : circle.on ?? noteLength
		);
		const startingPhase = Math.PI * 2 * circle.phase + (shapeIsHighToLow ? Math.PI : 0);
		const calculateOnVelocity = (ppq: number): number => {
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
			// see whether we need to introduce some rest time to accommodate for:
			//  a. noteLength != noteDuration
			//  b. rational `noteLength`
			const rest = Math.floor(noteLength * index - noteOnDuration * index - rested);
			if (shapeIsOnToOff) {
				result.durations!.push(noteOnDuration);
				result.notes.push(circle.notes);
				result.velocities!.push(calculateOnVelocity(ppq));
			}
			if (rest > 0) {
				result.durations!.push(rest);
				result.notes.push([]);
				result.velocities!.push(0);
				rested += rest;
			}
			if (!shapeIsOnToOff) {
				result.durations!.push(noteOnDuration);
				result.notes.push(circle.notes);
				result.velocities!.push(calculateOnVelocity(ppq));
			}
		}
		return result;
	}
}
