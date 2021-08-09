/**
 * @license MIT (see project's LICENSE file)
 */

import { ParseTextBuffer } from '@tiny/core';
import { IParsedInput } from './types';

/**
 * Picks the jumble apart and returns it or throws an error
 * @throws {Error}
 */
export function parseInput(input: string): IParsedInput {
	const result: IParsedInput = {
		sequences: [],
		symbols: {},
	};
	const buffer = new ParseTextBuffer(input);
	/**
	 * Going in for the first time and all subsequent operations after
	 * we want to remove leading white space. And then see if they time
	 * has come to hang up our abcs and move on in the alphabet
	 */
	const isEnd = (): boolean => {
		buffer.eatWhite();
		return buffer.isEnd();
	};
	while (!isEnd()) {
		let value;
		value = _getComment(buffer);
		if (value === null) {
			value = _getKeyValuePair(buffer);
			if (value) {
				result.symbols[value.key] = value.value;
			} else {
				value = _getSequence(buffer);
				if (value) {
					result.sequences.push(value);
				} else {
					throw new Error(`unknown syntax at ${buffer.remainder}`);
				}
			}
		}
	}
	_validate(result);
	return result;
}

/***********************
 * Private Interface
 **********************/
/**
 * Returns comment of throws an error if it isn't a comment
 * @throws {Error}
 */
function _getComment(buffer: ParseTextBuffer): string | unknown {
	const result = buffer.match(/#.+/);
	return result;
}

/**
 * Returns a key/value pair if it is a pair otherwise throws an error
 * @throws {Error}
 */
function _getKeyValuePair(
	buffer: ParseTextBuffer
): { key: string; value: string } | null {
	const result = buffer.match(/([-_$a-zA-Z]+)\s*=\s*(\w+)/);
	return result === null ? result : { key: result[0], value: result[1] };
}

/**
 * Think we will treat this as a last possible type among possibilities
 */
function _getSequence(buffer: ParseTextBuffer): string | null {
	// let's feel our way with this guy. Will assume it's all on one line for now.
	return buffer.match(/.+/) as string;
}

function _validate(parsed: Readonly<IParsedInput>): void {
	if (parsed.sequences.length === 0) {
		throw new Error('no sequence found');
	}
	if (parsed.sequences.length > 1) {
		throw new Error("we don't support multiple sequences yet");
	}
}
