/**
 * @license MIT (see project's LICENSE file)
 */

import {
	TinyEvaluateSequence,
	TinyEvaluateValue,
	TinyOperator,
	TinySymbolTable,
	TinyToken,
	TinyTokenSequence,
	TinyTokenType,
} from '../types';

interface EvaluateState {
	accumulator: TinyEvaluateValue;
	evaluateSequence: TinyEvaluateSequence;
	parseSequence: TinyTokenSequence;
	stack: TinyEvaluateSequence;
}

/**
 * Little tiny machine that processes and calculates a parsed tiny sequence
 */
export class TinyMachine {
	private readonly symbols: TinySymbolTable;

	constructor(symbols: TinySymbolTable = new TinySymbolTable()) {
		this.symbols = symbols;
	}

	/**
	 * @throws {Error}
	 */
	public evaluate(
		sequence: TinyTokenSequence,
		initialValue?: TinyEvaluateValue
	): TinyEvaluateSequence {
		const state: EvaluateState = {
			accumulator: 0,
			evaluateSequence: [],
			parseSequence: sequence.slice(),
			stack: [],
		};
		if (initialValue === undefined) {
			state.accumulator = this.getOperand(state);
		} else {
			state.accumulator = initialValue;
		}
		while (state.parseSequence.length > 0) {
			const operators = this.getOperators(state);
			const operand = this.getOperand(state);
			for (const operator of operators) {
				this.calculateOperation({ operator, operand, state });
			}
		}
		return state.evaluateSequence;
	}

	/********************
	 * Private Interface
	 ********************/
	/**
	 * Applies the operator to <param>value</param> and <param>operand</param>
	 * @throws {Error}
	 */
	private calculateOperation({
		operand,
		operator,
		state,
	}: {
		operand: TinyEvaluateValue;
		operator: TinyOperator;
		state: EvaluateState;
	}): void {
		type Operation = (left: number, right: number) => number;

		/**
		 * Calculates a binary operation and puts result into <param>state</param>
		 */
		function calculateBinaryOperation(operation: Operation): void {
			if (Array.isArray(operand)) {
				// because of validation we know that our <param>state.accumulator</param> is an array
				state.accumulator = operand.map((right, index) =>
					operation((state.accumulator as number[])[index], right)
				);
			} else if (Array.isArray(state.accumulator)) {
				// we apply our non scalar <param>operand</param> to every element in <param>state.accumulator</param>
				state.accumulator = state.accumulator.map((left) => operation(left, operand));
			} else {
				// both ar numbers
				state.accumulator = operation(state.accumulator, operand);
			}
		}

		/**
		 * Makes sure <param>state.stack</param> can be popped and pops value into <param>state.accumulator</param>
		 */
		function popStack() {
			if (state.stack.length === 0) {
				throw new Error('evaluation stack is empty');
			}
			state.accumulator = state.stack.pop() as TinyEvaluateValue;
		}

		function validateBinaryOperation(): void {
			if (Array.isArray(operand) === false) {
				// we allow all combinations of this. Either:
				//  1. single <param>state.accumulator</param> gets applied to all result scalar elements
				//  2. single <param>state.accumulator</param> gets applied to single result value
			} else if (Array.isArray(state.accumulator)) {
				if (state.accumulator.length !== (operand as number[]).length) {
					throw new Error(
						`operand and result scalar lengths must agree: operand = ${operand}, result = ${state.accumulator}`
					);
				}
			} else {
				throw new Error(
					'operand and result types must agree: operand is a number and result is a scalar'
				);
			}
		}

		switch (operator) {
			case TinyOperator.Add: {
				validateBinaryOperation();
				calculateBinaryOperation((left: number, right: number) => left + right);
				break;
			}
			case TinyOperator.Insert: {
				state.evaluateSequence.push(state.accumulator);
				break;
			}
			case TinyOperator.Multiply: {
				validateBinaryOperation();
				calculateBinaryOperation((left: number, right: number) => left * right);
				break;
			}
			case TinyOperator.Subtract: {
				validateBinaryOperation();
				calculateBinaryOperation((left: number, right: number) => left - right);
				break;
			}
			case TinyOperator.Pop: {
				popStack();
				break;
			}
			case TinyOperator.Push: {
				state.stack.push(state.accumulator);
				break;
			}
			default:
				throw new Error(`unknown operator ${operator}`);
		}
	}

	/**
	 * @throws {Error}
	 */
	private getOperand(state: EvaluateState): TinyEvaluateValue {
		const token = state.parseSequence.shift();
		if (token === undefined || token.type !== TinyTokenType.Operand) {
			throw new Error(`expecting operand. Found ${JSON.stringify(token)}`);
		}
		return Array.isArray(token.value)
			? token.value.map(this.operandSymbolToValue.bind(this))
			: this.operandSymbolToValue(token.value);
	}

	/**
	 * @throws {Error}
	 */
	private getOperators(state: EvaluateState): Array<TinyOperator> {
		const tokens: Array<TinyOperator> = [];
		while (
			state.parseSequence.length > 0 &&
			state.parseSequence[0].type === TinyTokenType.Operator
		) {
			tokens.push((state.parseSequence.shift() as TinyToken).value as TinyOperator);
		}
		if (tokens.length === 0) {
			throw new Error(
				`expecting operator. Found ${JSON.stringify(state.parseSequence[0])}`
			);
		} else {
			return tokens;
		}
	}

	/**
	 * Translates the operand's parse value into an evaluation value
	 */
	private operandSymbolToValue(parseValue: string): number {
		try {
			const translated: string = this.symbols.getSymbolWithDefault<string>(
				parseValue,
				parseValue
			);
			// let's see if this guy has prefix operators on him. Note: we should not be able to fail here.
			const [, accidentalText, resultText] = translated.match(
				/^([#b]*)(\d+)$/
			) as RegExpMatchArray;
			return Array.from(accidentalText || []).reduce(
				(result: number, accidental: string): number => {
					// we allow accidentals to be redefined
					const offset = Number(
						this.symbols.getSymbolWithDefault(accidental, accidental)
					);
					return result + offset;
				},
				Number(resultText)
			);
		} catch (error) {
			throw new Error(`unable to translate ${parseValue} to number`);
		}
	}
}
