import { LexicalParsePatterns } from './lexical';

/**
 * @license MIT (see project's LICENSE file)
 *
 * Primitive parsing. Throws errors upon failure.
 * Note: We assume that all surrounding whitespace has been trimmed.
 * It is possible to change this policy, but we are very vigilant
 * regarding whitespace when parsing.
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
	const match = value.match(LexicalParsePatterns.BooleanValue);
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
export function stringToFloat(value: string): number {
	const parsed = Number.parseFloat(value);
	if (isNaN(parsed)) {
		throw new Error(`unable to parse "${value}" as a float value`);
	}
	return parsed;
}

/**
 * Parses and returns the integer or throws an error if parse fails
 * @param value
 * @throws {Error}
 */
export function stringToInteger<T extends number>(value: string): T {
	const parsed = Number.parseInt(value);
	if (isNaN(parsed)) {
		throw new Error(`unable to parse "${value}" as an integer value`);
	}
	return parsed as T;
}

/**
 * Parses and returns the integers or throws an error if parse fails.
 * Parameterized so that you may convert numbers to enums and friends.
 * @param value
 * @throws {Error}
 */
export function stringToIntegers<T extends number>(value: string): T[] {
	const stripped = value.match(LexicalParsePatterns.ArrayElements);
	if (!stripped) {
		throw new Error(`unable to parse "${value}" as an array of integers`);
	}
	return stripped[1].split(LexicalParsePatterns.ElementSplit).map(stringToInteger) as T[];
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
