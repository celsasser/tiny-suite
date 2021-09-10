/**
 * @license MIT (see project's LICENSE file)
 */

import { SymbolMap } from './algorithms';

/**
 * Designed so that `value` may be added directly to a symbol table
 */
export interface ISymbolTableResource<T = unknown> {
	readonly description: string;
	readonly values: SymbolMap<T>;
}
