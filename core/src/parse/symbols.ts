/**
 * @license MIT (see project's LICENSE file)
 *
 * Less primitive parsing. Includes support for symbols.
 * Note: We assume that all surrounding whitespace has been trimmed.
 * It is possible to change this policy, but we are very vigilant
 * regarding whitespace when parsing.
 */
import { SymbolTable } from '../algorithms';
import { getMidiNoteNameSymbols } from '../resource';
import { LexicalPatterns } from '../types/lexical';
import { stringToInteger } from './primitives';

/**
 * Parses and returns the integer or throws an error if parse fails
 * @param value
 * @param table - table from within which symbols will be resolved
 * @throws {Error}
 */
export function symbolToInteger<T extends number>(
	value: string,
	table: SymbolTable = getDefaultSymbolTable()
): T {
	const numbers = value.match(/^\d+$/);
	if (numbers) {
		return stringToInteger<T>(value);
	} else {
		return table.getSymbol(value) as T;
	}
}

/**
 * Parses and returns the integers or throws an error if parse fails.
 * Parameterized so that you may convert numbers to enums and friends.
 * @param value
 * @param table - table from within which symbols will be resolved
 * @throws {Error}
 */
export function symbolsToIntegers<T extends number>(
	value: string,
	table: SymbolTable = getDefaultSymbolTable()
): T[] {
	const stripped = value.match(LexicalPatterns.ArrayContents);
	if (!stripped) {
		throw new Error(`unable to parse "${value}" as an array of integers/symbols`);
	}
	return stripped[1]
		.split(/\s*,\s*/)
		.map((value) => symbolToInteger(value, table)) as T[];
}

/***********************
 * Private Interface
 **********************/
function getDefaultSymbolTable(): SymbolTable<number> {
	return new SymbolTable<number>({ symbols: getMidiNoteNameSymbols().values });
}
