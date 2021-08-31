/**
 * @license MIT (see project's LICENSE file)
 */

export type MidiChannelType =
	| 0
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 13
	| 14
	| 15;

export interface TimeSignature {
	denominator: number;
	numerator: number;
}
