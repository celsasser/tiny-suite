/**
 * @license MIT (see project's LICENSE file)
 *
 * Types that are part of tiny's ecosystem
 */

export type MonophonicArray = number[];
export type PolyphonicArray = Array<number | number[]>;

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

/**
 * For all objects to which randomness may be applied
 */
export interface IWeighted {
	weight: number;
}

export type StringKeyedObject = { [property: string]: any };
