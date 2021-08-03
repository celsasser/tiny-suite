/**
 * @license MIT (see project's LICENSE file)
 *
 * Access to some definitions that we manage within for convenience.
 */

import { ISymbolTableResource } from '../types';
import { loadModuleJsonResource } from './load';

export function getNoteIntervalSymbols(): ISymbolTableResource<number> {
	return loadModuleJsonResource('./res/symbols/intervals.json');
}

export function getNoteNameSymbols(): ISymbolTableResource<number> {
	return loadModuleJsonResource('./res/symbols/noteNames.json');
}
