/**
 * @license MIT (see project's LICENSE file)
 *
 * Primitive parsing. Throws errors upon failure
 */

/**
 * Parses and returns the integer or throws an error if parse fails
 * @param value
 * @throws {Error}
 */
export function stringToBoolean(value: string): boolean {
	const match = value.match(/^(true)|(false)|(\d+)$/i);
	if (match === null) {
		throw new Error(`unable parse "${value}" as a boolean value`);
	} else if (match[1]) {
		return true;
	} else if (match[2]) {
		return false;
	} else {
		return Boolean(Number(match[3]));
	}
}

/**
 * Parses and returns the integer or throws an error if parse fails
 * @param value
 * @throws {Error}
 */
export function stringToInteger(value: string): number {
	const converted = parseInt(value);
	if (isNaN(converted)) {
		throw new Error(`unable parse "${value}" as an integer value`);
	}
	return converted;
}
