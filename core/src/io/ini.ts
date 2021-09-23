/**
 * @license MIT (see project's LICENSE file)
 */
import { ParseTextBuffer } from '../parse';
import { IKeyValuePair, LexicalPatterns } from '../types';

export function getIniHeading(
	buffer: Readonly<ParseTextBuffer>,
	pattern = LexicalPatterns.IniSymbolDeclaration
): string | undefined {
	const match = buffer.match(pattern);
	return match ? match[0] : undefined;
}

export function getIniHeadings(
	buffer: Readonly<ParseTextBuffer>,
	pattern = LexicalPatterns.IniSymbolDeclaration
): string[] | undefined {
	let name: string | undefined;
	const names: string[] = [];
	while ((name = getIniHeading(buffer, pattern))) {
		names.push(name);
	}
	return names.length > 0 ? names : undefined;
}

export function getIniProjectHeading(
	buffer: Readonly<ParseTextBuffer>,
	pattern = LexicalPatterns.IniProjectDeclaration
): string | undefined {
	return getIniHeading(buffer, pattern);
}

export function getIniPropertyAssignment(
	buffer: Readonly<ParseTextBuffer>,
	pattern = LexicalPatterns.IniPropertyAssignment
): IKeyValuePair | undefined {
	const match = buffer.match(pattern);
	return match
		? {
				key: match[0],
				value: match[1],
		  }
		: undefined;
}

export function getIniPropertyAssignments(
	buffer: Readonly<ParseTextBuffer>,
	pattern = LexicalPatterns.IniPropertyAssignment
): IKeyValuePair[] | undefined {
	let pair: IKeyValuePair | undefined;
	const pairs: IKeyValuePair[] = [];
	while ((pair = getIniPropertyAssignment(buffer, pattern))) {
		pairs.push(pair);
	}
	return pairs.length > 0 ? pairs : undefined;
}
