/**
 * @license MIT (see project's LICENSE file)
 */

import { StringKeyedObject } from '../types';

/**
 * Is `name` a key in `object`
 */
export function isValidEnumName(
	object: Readonly<StringKeyedObject>,
	name: string
): boolean {
	return Object.keys(object).includes(name);
}

/**
 * Is `value` a value in `object`
 */
export function isValidEnumValue(
	object: Readonly<StringKeyedObject>,
	value: string
): boolean {
	return Object.values(object).includes(value);
}
