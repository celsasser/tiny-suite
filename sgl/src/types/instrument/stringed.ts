/**
 * @license MIT (see project's LICENSE file)
 */

/**
 * A single string on a stringed instrument
 */
export interface TinyInstrumentString {
	description?: string;
	name?: string;
	/**
	 * The MIDI offset of the string at fret position 0
	 */
	offset: number;
}
