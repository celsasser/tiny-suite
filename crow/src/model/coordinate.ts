/**
 * @license MIT (see project's LICENSE file)
 */

import { doUntil, stringToInteger } from '@tiny/core';
import { ICoordinate, ISize } from '../types';

const VALID_COLUMN_REGEX = /^[A-Z]+$/i;
// todo: we are going to assume that id's start with "$"?
const COORDINATE_ID_REGEX = /^\s*\$?([A-Z]+)([1-9][0-9]*)\s*$/i;

/**
 * Converts a column [0 - (n-1)] based column index into its excel style encoding
 * @returns the column code for the specified index.
 */
export function columnIndexToCode(index: number): string {
	return doUntil<string>(
		() => index >= 0,
		(accumulator: string): string => {
			const placeCode = String.fromCharCode('A'.charCodeAt(0) + (index % 26));
			index = Math.floor(index / 26) - 1;
			return `${placeCode}${accumulator}`;
		},
		''
	);
}

/**
 * Converts a column from its excel style encoding to a [0 - (n-1)] index
 * @returns the column code for the specified index.
 * @throws {Error}
 */
export function columnCodeToIndex(code: string): number {
	if (VALID_COLUMN_REGEX.test(code) === false) {
		throw new Error(`unsupported column characters in "${code}"`);
	}
	const result = doUntil(
		(iteration: number): boolean => iteration < code.length,
		(accumulator: number, iteration: number): number => {
			const characterCode = code
				.charAt(code.length - iteration - 1)
				.toUpperCase()
				.charCodeAt(0);
			const delta = characterCode - 'A'.charCodeAt(0);
			// we add 1 to `delta` so that 'A' behaves like 1 and not 0.
			// We will correct for it.
			return accumulator + Math.pow(26, iteration) * (delta + 1);
		},
		0
	);
	// here we are treating for our adding 1 to the 26^0 position.
	return result - 1;
}

/**
 * @param index
 * @returns the row code for the specified index
 */
export function rowIndexToCode(index: number): string {
	return (index + 1).toString();
}

export function rowCodeToIndex(code: string): number {
	return stringToInteger(code) - 1;
}

/**
 * Creates an instance of `CoordinateId` from a valid id
 * @param id
 * @throws {Error}
 */
export function coordinateFromId(id: string): ICoordinate {
	const match = id.match(COORDINATE_ID_REGEX);
	if (match === null) {
		throw new Error(`unrecognized coordinate id "${id}"`);
	}
	return {
		x: columnCodeToIndex(match[2]),
		y: columnCodeToIndex(match[1]),
	};
}

export function coordinateToId(coordinate: Readonly<ICoordinate>): string {
	const columnId = columnIndexToCode(coordinate.x);
	const rowId = rowIndexToCode(coordinate.y);
	return `$${columnId}${rowId}`;
}

/**
 * Whether coordinate is in the box described by `size` or not
 */
export function isCoordinateWithinSize(
	coordinate: Readonly<ICoordinate>,
	size: Readonly<ISize>
): boolean {
	return (
		coordinate.x >= 0 &&
		coordinate.x <= size.width &&
		coordinate.y >= 0 &&
		coordinate.y <= size.height
	);
}
