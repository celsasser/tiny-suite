/**
 * @license MIT (see project's LICENSE file)
 */

import * as _ from 'lodash';
import { getMidiNoteNameSymbols, ISymbolTableResource } from '@tiny/core';
import { loadModuleJsonResource } from '../core/resource';
import { TinyEvaluateSequence, TinySymbolMap, TinySymbolTable } from '../types';
import { TinyMachine } from './evaluate';
import { TinyParser } from './parse';

/**
 * Generates a sequence of midi values
 * @param code - tiny language description of a sequence
 * @param symbols - optional table of symbols (see SymbolTable)
 * @throws {Error}
 */
export function generateTinySequence(
	code: string,
	symbols?: TinySymbolMap
): TinyEvaluateSequence {
	const parser = new TinyParser();
	const sequence = parser.parse(code);
	const table = _createSymbolTable(symbols);
	const machine = new TinyMachine(table);
	return machine.evaluate(
		sequence,
		table.getSymbolWithDefault('initialValue', undefined)
	);
}

/***********************
 * Private Interface
 **********************/
/**
 * Prepares a default symbol table with our defaults and then
 * overlays `symbols` as a "scope" if it exists.
 */
export function _createSymbolTable(symbols?: TinySymbolMap): TinySymbolTable {
	let symbolTable: TinySymbolTable = new TinySymbolTable();
	symbolTable.addSymbols(getMidiNoteNameSymbols().values);
	symbolTable.addSymbols(
		loadModuleJsonResource<ISymbolTableResource<number | string>>(
			'./res/symbols/core.json'
		).values
	);
	if (!_.isEmpty(symbols)) {
		symbolTable = symbolTable.pushScope();
		symbolTable.addSymbols(symbols!);
	}
	return symbolTable;
}
