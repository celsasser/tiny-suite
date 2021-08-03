/**
 * @license MIT (see project's LICENSE file)
 */

import { SymbolMap, SymbolTable } from 'tiny-core-module';

export enum TinyOperator {
	/**
	 * Offset existing values.
	 */
	Add = '+',
	/**
	 * Insert into sequence
	 */
	Insert = '^',
	/**
	 * Clones existing values and offsets them.
	 */
	Multiply = '*',
	/**
	 * Offset existing values.
	 */
	Subtract = '-',
	/**
	 * Pushes current accumulator onto the stack
	 */
	Pop = '$-',
	/**
	 * Pops stack into accumulator
	 */
	Push = '$+',
}

export enum TinyTokenType {
	Operator = 'operator',
	Operand = 'operand',
}

export type TinyEvaluateValue = number | number[];
export type TinyEvaluateSequence = Array<TinyEvaluateValue>;
export type TinyParseOperand = string | string[];
/**
 * A parsed sequence
 */
export type TinyTokenSequence = Array<TinyToken>;
export type TinyTokenValue = TinyOperator | TinyParseOperand;

export interface TinyToken {
	type: TinyTokenType;
	value: TinyTokenValue;
}

export type TinySymbolMap = SymbolMap<string | number>;
export class TinySymbolTable extends SymbolTable<string | number> {}
