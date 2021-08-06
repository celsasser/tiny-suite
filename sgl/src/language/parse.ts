/**
 * @license MIT (see project's LICENSE file)
 */

import { ParseTextBuffer } from '@tiny/core';
import { ParseError, TinyOperator, TinyTokenSequence, TinyTokenType } from '../types';

/**
 * Library of patterns we use to identify parts of a tiny expression
 */
class LexicalPatterns {
	/**
	 * We parse each operator independently as opposed to an operator sequence
	 */
	public static readonly Operator = /\s*(\+|-|\*|\^|\$\+|\$-)\s*/;
	public static readonly Element = /[a-zA-Z]\w*(\[\d+\])+|[#b]*\d+|[a-zA-Z]\w*/;
	public static readonly ElementArray = new RegExp(
		`\\[\\s*((${LexicalPatterns.Element.source})(\\s*,\\s*(${LexicalPatterns.Element.source}))*)\\s*]`
	);
	public static readonly Operand = new RegExp(
		`\\s*((${LexicalPatterns.Element.source})|${LexicalPatterns.ElementArray.source})\\s*`
	);
}

/**
 * The grammar is described as follows:
 *  expression: operand sequence | sequence
 *  sequence: EOS | operations sequence
 *  operations: operator+ operand
 *  operand: /[#b]*\d+/
 *    "#" - by default increases by 1
 *    "b" - by default decreases by 1 (conflict with variable names but think we will error on side of consistency here)
 *  operator: "+"|"-"|"^"|"$+"|"$-"
 */
export class TinyParser {
	private buffer: ParseTextBuffer = new ParseTextBuffer('');

	/**
	 * Parses the sequence and returns the parsed sequence
	 * @throws {Error}
	 */
	public parse(code: string): TinyTokenSequence {
		const sequence: TinyTokenSequence = [];
		this.buffer = new ParseTextBuffer(code);
		this.parseExpression(sequence);
		return sequence;
	}

	/********************************************************
	 * Private Interface
	 * The grammar is described as follows:
	 ********************************************************/
	private parseExpression(sequence: TinyTokenSequence): void {
		if (this.buffer.peek(LexicalPatterns.Operand)) {
			this.parseOperand(sequence);
		}
		this.parseSequence(sequence);
	}

	private parseOperand(sequence: TinyTokenSequence): void {
		const match: string[] = this.buffer.match(LexicalPatterns.Operand) as string[];
		if (match === null) {
			throw new ParseError(this.buffer.toString(), this.buffer.remainder);
		} else {
			if (match[1]) {
				sequence.push({
					type: TinyTokenType.Operand,
					value: match[1],
				});
			} else {
				sequence.push({
					type: TinyTokenType.Operand,
					value: match[3].split(/\s*,\s*/),
				});
			}
		}
	}

	private parseOperators(sequence: TinyTokenSequence): void {
		let match: string[] = this.buffer.match(LexicalPatterns.Operator) as string[];
		// there must be at least one operator
		if (match === null) {
			throw new ParseError(this.buffer.toString(), this.buffer.remainder);
		} else {
			sequence.push({
				type: TinyTokenType.Operator,
				value: match[0] as TinyOperator,
			});
			// and now we take whatever operators may exist in addition to the required operator
			while ((match = this.buffer.match(LexicalPatterns.Operator) as string[])) {
				sequence.push({
					type: TinyTokenType.Operator,
					value: match[0] as TinyOperator,
				});
			}
		}
	}

	private parseSequence(sequence: TinyTokenSequence): void {
		if (this.buffer.isEnd() === false) {
			// parse the "operation"
			this.parseOperators(sequence);
			this.parseOperand(sequence);
			this.parseSequence(sequence);
		}
	}
}
