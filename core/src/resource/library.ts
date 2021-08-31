/**
 * @license MIT (see project's LICENSE file)
 *
 * Access to some definitions that we manage within for convenience.
 */

import { ISymbolTableResource } from '../types';
import { loadModuleJsonResource } from './load';

export function getMidiDefaultSymbols(): ISymbolTableResource<any> {
	return loadModuleJsonResource('./res/midi/symbols/defaults.json');
}

export function getMidiNoteIntervalSymbols(): ISymbolTableResource<number> {
	return loadModuleJsonResource('./res/midi/symbols/intervals.json');
}

export function getMidiNoteNameSymbols(): ISymbolTableResource<number> {
	return loadModuleJsonResource('./res/midi/symbols/noteNames.json');
}
