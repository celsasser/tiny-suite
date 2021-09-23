/**
 * @license MIT (see project's LICENSE file)
 *
 * Types that are part of tiny's ecosystem
 */
import { MidiChannelType } from 'midi-file-io';

export type MonophonicArray = number[];
export type PolyphonicArray = Array<number | number[]>;
export type StringKeyedObject = { [property: string]: any };

export interface IChannel {
	channel?: MidiChannelType;
	durations?: MonophonicArray;
	/**
	 * Optional name of this channel. Will default to `track <index+1>`
	 */
	name?: string;
	notes: PolyphonicArray;
	pan?: MonophonicArray;
	/**
	 * Optional name of the MIDI program for this channel. See `generalMidi.json`
	 */
	program?: string;
	velocities?: MonophonicArray;
}

export interface IKeyValuePair<K = string, V = string> {
	key: K;
	value: V;
}

export interface INumericRange {
	/**
	 * minimum allowed value
	 */
	min: number;
	/**
	 * maximum allowed value (inclusive)
	 */
	max: number;
}

export interface IToStringLike {
	toString(): string;
}

/**
 * For all objects to which randomness may be applied
 */
export interface IWeighted {
	weight: number;
}
