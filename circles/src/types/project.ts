/**
 * @license MIT (see project's LICENSE file)
 */

import { MidiChannelType } from '@tiny/core';
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
	off?: number;
	on?: number;
	phase: number;
	shape: CircleShape;
}

export interface IProjectProperties {
	name?: string;
	/**
	 * The total length described in our PPQ|B:N|B:M:N spec
	 */
	length: number;
}

export interface IParsedInput {
	circles: ICircleProperties[];
	project: IProjectProperties;
}
