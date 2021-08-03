/**
 * @license MIT (see project's LICENSE file)
 */

/**
 * Appends items to the end of the `array`
 * @param array
 * @param items
 */
export function appendArray<T>(array: T[], items: T[]): void {
	array.splice(array.length, 0, ...items);
}
