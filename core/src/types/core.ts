/**
 * @license MIT (see project's LICENSE file)
 *
 * Types that are part of tiny's ecosystem
 */

export type MonophonicArray = number[];
export type PolyphonicArray = Array<number | number[]>;
export type StringKeyedObject = { [property: string]: any };

export interface IChannel {
	durations?: MonophonicArray;
	notes: PolyphonicArray;
	pan?: MonophonicArray;
	velocities?: MonophonicArray;
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
