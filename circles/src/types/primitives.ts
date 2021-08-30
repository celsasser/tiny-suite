/**
 * @license MIT (see project's LICENSE file)
 */

export enum CircleShape {
	/**
	 * From high to low
	 */
	HighToLow = 'HTL',
	/**
	 * From low to high
	 */
	LowToHigh = 'LTH',
}

export type NumbersServer = () => number[];
