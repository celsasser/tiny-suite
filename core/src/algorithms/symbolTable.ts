/**
 * @license MIT (see project's LICENSE file)
 */

import * as assert from 'assert';
import { RuntimeError, SymbolMap, UnknownSymbolError } from '../types';

/**
 * It's a SymbolTable with a simple mechanism for supporting scopes. Scopes are just
 * instances of SymbolTable. And they work by search from the most recently pushed to
 * the base SymbolTable which could be considered a "global" scope.
 */
export class SymbolTable<V = unknown> {
	private readonly _table: Map<string, V> = new Map<string, V>();
	/**
	 * This is our means of supporting scopes. Honestly, I am playing. I don't have a use
	 * case But like the idea of being able to preserve our "global" collection
	 * @private
	 */
	private readonly _parent?: SymbolTable<V>;

	/**
	 * Constructor
	 * @param symbols - optional prime for the pump
	 * @param parent - should let our internal methods do this work. See `push|pop<Scope>`
	 */
	public constructor({
		symbols,
		parent,
	}: {
		symbols?: Readonly<SymbolMap<V>>;
		parent?: SymbolTable<V>;
	} = {}) {
		assert.ok(
			arguments.length === 0 || symbols || parent,
			'compiler does not catch failure to compose'
		);
		if (parent) {
			this._parent = parent;
		}
		if (symbols) {
			this.addSymbols(symbols);
		}
	}

	/*************************
	 * Public Scope Management
	 ************************/
	/**
	 * Add a new scope at the top of the search chain.
	 * @returns the new scope
	 */
	public pushScope(): SymbolTable<V> {
		return new SymbolTable<V>({ parent: this });
	}

	/**
	 * Pops the scope off of the top of the search stack
	 * @returns previous scope
	 */
	public popScope(): SymbolTable<V> {
		if (this._parent) {
			return this._parent;
		}
		throw new RuntimeError('no parent scope');
	}

	/*************************
	 * Public Symbol Management
	 ************************/
	public addSymbol(name: string, value: V): void {
		this._table.set(name, value);
	}

	/**
	 * May add a batch of symbols. And may add case variations if you like. Repeats will
	 * be overwritten
	 */
	public addSymbols(
		symbols: Readonly<SymbolMap<V>>,
		{
			addLowercaseVariation = false,
			addUppercaseVariation = false,
		}: {
			addLowercaseVariation?: boolean;
			addUppercaseVariation?: boolean;
		} = {}
	): void {
		type KeyFormatterType = (key: string) => string;
		const keyFormatters: KeyFormatterType[] = [(key: string) => key];
		if (addLowercaseVariation) {
			keyFormatters.push((key: string) => key.toLowerCase());
		}
		if (addUppercaseVariation) {
			keyFormatters.push((key: string) => key.toUpperCase());
		}
		for (const keyFormatter of keyFormatters) {
			Object.keys(symbols).forEach((key: string): void => {
				this._table.set(keyFormatter(key), symbols[key]);
			});
		}
	}

	/**
	 * Looks for symbol from the top down. And returns the first instance found.
	 * @param key - key of the value you are looking for
	 * @param deepResolve - whether to search a chain of possible references from one
	 *    result to anther's key
	 * @throws {UnknownSymbolError} if symbol cannot be found
	 */
	public getSymbol<T = V>(key: string, deepResolve = true): T {
		let result = this._getSymbol<T>(key);
		if (deepResolve) {
			// todo: this is pretty bare bones. We could go farther. For example, consider that
			//  the `result` is an array with references to symbols within. But we are primitive folk.
			try {
				while (typeof result === 'string') {
					result = this._getSymbol(result);
				}
			} catch {
				// this is the end of the line. Return our last `result`
			}
		}
		return result;
	}

	/**
	 * Looks for symbol from the top down. And returns the first instance found.
	 * @param key - key of the value you are looking for
	 * @param defaultValue - optional default value if key cannot be found
	 * @param deepResolve - whether to search a chain of possible references from one
	 *    result to anther's key
	 */
	public getSymbolWithDefault<T = V>(
		key: string,
		defaultValue: T,
		deepResolve = true
	): T {
		try {
			return this.getSymbol<T>(key, deepResolve);
		} catch (error) {
			if (error instanceof UnknownSymbolError) {
				return defaultValue;
			} else {
				throw error;
			}
		}
	}

	/***********************
	 * Private Interface
	 **********************/
	/**
	 * Looks for symbol from the top down. And returns the first instance found.
	 * @throws {UnknownSymbolError} if symbol cannot be found
	 */
	private _getSymbol<T = V>(key: string): T {
		if (this._table.has(key)) {
			return this._table.get(key) as unknown as T;
		} else if (this._parent) {
			return this._parent._getSymbol(key);
		} else {
			throw new UnknownSymbolError(key);
		}
	}
}
