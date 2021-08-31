/**
 * @license MIT (see project's LICENSE file)
 */

import { IToStringLike, UnknownSymbolError } from '../types';

/**
 * Caches objects by string key. All cached objects are assumed to be shared
 * hence will be frozen.
 */
export class Cache<T = any, K extends IToStringLike = string> {
	private readonly _cache = new Map<K, T>();

	/**
	 * Gets value
	 * @param key - name he's known by in these parts....
	 * @throws {UnknownSymbolError} if `key` cannot be found
	 */
	public getByKey(key: K): Readonly<T> {
		const result = this._cache.get(key);
		if (result !== undefined) {
			return result;
		}
		throw new UnknownSymbolError(key.toString());
	}

	/**
	 * Will freeze the object and then cache it
	 * @param key
	 * @param object
	 */
	public setByKey(key: K, object: Readonly<T>): Readonly<T> {
		object = Object.freeze(object);
		this._cache.set(key, object);
		return object;
	}
}
