/**
 * @license MIT (see project's LICENSE file)
 */

import { SymbolMap } from 'tiny-core-module';

/**
 * Defines a symbol table generator in the form of tuba, trumpet, guitar, ukulele, kazoo, hippopotamus...
 */
export interface TinyInstrument {
	generate(): SymbolMap<string>;
}
