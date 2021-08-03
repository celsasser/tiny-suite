/**
 * @license MIT (see project's LICENSE file)
 *
 * Primitive parsing. Throws errors upon failure
 */

/**
 * Parses and returns the value
 * @param value
 * @throws {Error}
 */
export function stringToInteger(value: string): number {
	const converted = parseInt(value);
	if (converted === Number.NaN) {
		throw new Error(`unable parse "${value}" as an integer`);
	}
	return converted;
}
