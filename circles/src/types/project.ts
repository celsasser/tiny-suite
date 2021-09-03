/**
 * @license MIT (see project's LICENSE file)
 */

import { MidiChannelType, TimeSignature } from '@tiny/core';
import { CircleShape } from './primitives';

export interface ICircleProperties {
	channel?: MidiChannelType;
	description?: string;
	diameter: number;
	divisions: number;
	min: number;
	max: number;
	/**
	 * Defaulted from the ini declaration
	 */
	name: string;
	notes: number[];
	/**
	 * Optional off duration (or percentage) of the note. It should be less than the total
	 * duration of a division. Note: there is no reason to use both `on` and `off`
	 */
	off?: number;
	/**
	 * Optional on duration (or percentage) of the note. It can be longer than the PPQ of
	 * a division. Note: there is no reason to use both `on` and `off`
	 */
	on?: number;
	/**
	 * Normalized ([0-1)) value of phase. Why not based on the more standard 2*PI.
	 * 'Cause we have no painless access to PI within our ini files.
	 * Defaults to 0.
	 */
	phase: number;
	shape: CircleShape;
}

export interface IProjectProperties {
	name?: string;
	ppq?: number;
	/**
	 * The total length described in our PPQ|B:N|B:M:N spec
	 */
	length: number;
	timesignature?: TimeSignature;
}

export interface IParsedInput {
	circles: ICircleProperties[];
	project: IProjectProperties;
}
