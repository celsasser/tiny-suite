/**
 * @license MIT (see project's LICENSE file)
 *
 * Access to some definitions that we manage within for convenience.
 */

import { ISymbolTableResource } from '../types';
import { Cache } from './cache';
import { loadModuleJsonResource } from './load';

const cache = new Cache();

export function getGeneralMidiProgramSymbols(): Readonly<ISymbolTableResource<string>> {
	return _getCachedResource('./res/midi/symbols/generalMidi.json');
}

export function getMidiDefaultSymbols(): Readonly<ISymbolTableResource<any>> {
	return _getCachedResource('./res/midi/symbols/defaults.json');
}

export function getMidiNoteIntervalSymbols(): Readonly<ISymbolTableResource<number>> {
	return _getCachedResource('./res/midi/symbols/intervals.json');
}

export function getMidiNoteNameSymbols(): Readonly<ISymbolTableResource<number>> {
	return _getCachedResource('./res/midi/symbols/noteNames.json');
}

/***********************
 * Private Interface
 **********************/
/**
 * Gets or loads and sets and gets the specified resource
 * @param key
 */
function _getCachedResource<T>(key: string): Readonly<T> {
	try {
		return cache.getByKey(key);
	} catch {
		return cache.setByKey(key, loadModuleJsonResource(key));
	}
}
