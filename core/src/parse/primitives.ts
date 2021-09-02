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
export function stringToInteger<T extends number>(value: string): T {
	const converted = parseInt(value);
	if (isNaN(converted)) {
		throw new Error(`unable to parse "${value}" as an integer value`);
	}
	return converted as T;
}

/**
 * Parses and returns the integers or throws an error if parse fails.
 * Parameterized so that you may convert numbers to enums and friends.
 * @param value
 * @throws {Error}
 */
export function stringToIntegers<T extends number>(value: string): T[] {
	if (!isStringAnArray((value = value.trim()))) {
		throw new Error(`unable to parse "${value}" as an array of integers`);
	}
	const values = value.substring(1, value.length - 1);
	return values.split(/\s*,\s*/).map(stringToInteger) as T[];
}

/**
 * Uses JS's trim to trim the edges and evaluates for existence of stuff in the middle
 * @param value
 * @returns a non empty string or `undefined`
 */
export function trimString(value?: string): string | undefined {
	if (value) {
		value = value.trim();
		return value.length > 0 ? value : undefined;
	}
	undefined;
}
