/**
 * @license MIT (see project's LICENSE file)
 *
 * Primitive parsing. Throws errors upon failure
 */

export function isStringAnArray(value: string): boolean {
	value = value.trim();
	return value.startsWith('[') && value.endsWith(']');
}

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
		throw new Error(`unable to parse "${value}" as an integer value`);
	}
	return converted;
}

/**
 * Parses and returns the integers or throws an error if parse fails
 * @param value
 * @throws {Error}
 */
export function stringToIntegers(value: string): number[] {
	if (!isStringAnArray((value = value.trim()))) {
		throw new Error(`unable to parse "${value}" as an array of integers`);
	}
	const values = value.substring(1, value.length - 1);
	return values.split(/\s*,\s*/).map(stringToInteger);
}

/**
 * Returns a non empty string or undefined. Uses JS's trim to trim the edges
 * @param value
 * @returns
 */
export function trimString(value?: string): string | undefined {
	if (value) {
		value = value.trim();
		return value.length > 0 ? value : undefined;
	}
	undefined;
}
