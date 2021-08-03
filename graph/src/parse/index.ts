/**
 * @license MIT (see project's LICENSE file)
 */

import * as _ from 'lodash';
import { getNoteNameSymbols, ParseTextBuffer } from 'tiny-core-module';
import {
	EdgePropertyName,
	IParsedInput,
	IProjectProperties,
	ProjectPropertyName,
	TinySymbolTable,
	VertexPropertyName,
} from '../types';
import { buildGraph } from './build';
import { LexicalPatterns } from './lexical';
import {
	InterimEdgeConstructorParams,
	InterimEdgeConstructorParamsArray,
	InterimVertexConstructorParams,
	InterimVertexConstructorParamsMap,
	IPropertyAssignment,
} from './types';
import { validate } from './validate';

/* eslint-disable no-mixed-spaces-and-tabs */

/**
 * Picks the jumble apart and returns it or throws an error
 * @throws {Error}
 */
export function parseInput(input: string): IParsedInput {
	const result: Partial<IParsedInput> = {};
	const buffer = new ParseTextBuffer(input);
	const edges: InterimEdgeConstructorParamsArray = [];
	const vertices: InterimVertexConstructorParamsMap = {};
	const symbols = new TinySymbolTable({ symbols: getNoteNameSymbols().values });

	/**
	 * Removes meaningless stuff and then checks on where we are
	 */
	const isEnd = (): boolean => {
		_eatCommentsAndSpace(buffer);
		return buffer.isEnd();
	};
	let value: any;
	while (!isEnd()) {
		if ((value = _getProject(buffer))) {
			result.project = value;
		} else if ((value = _getVertex(buffer))) {
			vertices[value.name] = value;
		} else if ((value = _getEdge(buffer))) {
			edges.push(value);
		} else {
			throw new Error(`unrecognized input text "${_.truncate(buffer.remainder)}"`);
		}
	}
	result.graph = buildGraph(vertices, edges, symbols);
	return validate(result as IParsedInput);
}

/***********************
 * Private Interface
 **********************/
function _eatCommentsAndSpace(buffer: ParseTextBuffer): void {
	buffer.match(LexicalPatterns.CommentsAndSpace);
}

function _getProject(buffer: ParseTextBuffer): IProjectProperties | undefined {
	const matches = buffer.match(LexicalPatterns.ProjectDeclaration);
	if (matches) {
		let propertyAssignment;
		const properties: Partial<IProjectProperties> = {};
		while ((propertyAssignment = _getPropertyAssignment(buffer))) {
			// we really don't care if the user adds properties but our concern is that
			// they may have misspelled a known property
			if (Object.values<string>(ProjectPropertyName).includes(propertyAssignment.name)) {
				// @ts-expect-error: he doesn't trust me (with good reason)
				properties[propertyAssignment.name] = propertyAssignment.rvalue;
			} else {
				throw new Error(
					`property "${propertyAssignment.name}" does not exist on "project:"`
				);
			}
		}
		return properties as IProjectProperties;
	}
	return undefined;
}

function _getEdge(buffer: ParseTextBuffer): InterimEdgeConstructorParams | undefined {
	const matches = buffer.match(LexicalPatterns.EdgeDeclaration);
	if (matches) {
		let propertyAssignment;
		const properties: Partial<InterimEdgeConstructorParams> = {
			name: matches[0],
			vertexFrom: matches[1],
			vertexTo: matches[2],
		};
		while ((propertyAssignment = _getPropertyAssignment(buffer))) {
			if (Object.values<string>(EdgePropertyName).includes(propertyAssignment.name)) {
				// @ts-expect-error: he doesn't trust me (with good reason)
				properties[propertyAssignment.name] = propertyAssignment.rvalue;
			} else {
				throw new Error(`property "${propertyAssignment.name}" does not exist on edges`);
			}
		}
		return properties as InterimEdgeConstructorParams;
	}
	return undefined;
}

function _getVertex(buffer: ParseTextBuffer): InterimVertexConstructorParams | undefined {
	const matches = buffer.match(LexicalPatterns.VertexDeclaration);
	if (matches) {
		let propertyAssignment;
		const properties: Partial<InterimVertexConstructorParams> = {
			name: matches[0],
		};
		while ((propertyAssignment = _getPropertyAssignment(buffer))) {
			if (Object.values<string>(VertexPropertyName).includes(propertyAssignment.name)) {
				// @ts-expect-error: he don't know....
				properties[propertyAssignment.name] = propertyAssignment.rvalue;
			} else {
				throw new Error(
					`property "${propertyAssignment.name}" does not exist on vertices`
				);
			}
		}
		return properties as InterimVertexConstructorParams;
	}
	return undefined;
}

/**
 * Very low investment for now
 * @param buffer
 */
function _getPropertyAssignment(
	buffer: ParseTextBuffer
): IPropertyAssignment | undefined {
	// I don't like potentially mutating the buffer unless there is a match but
	// am making an exception in this case because it makes the world up above simpler.
	_eatCommentsAndSpace(buffer);
	const match = buffer.match(LexicalPatterns.PropertyAssignment);
	return match
		? {
				name: match[0],
				rvalue: match[1],
		  }
		: undefined;
}
