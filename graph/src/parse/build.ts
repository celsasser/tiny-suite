/**
 * @license MIT (see project's LICENSE file)
 */

import * as _ from 'lodash';
import { INumericRange, MidiChannelType, ParseTextBuffer } from '@tiny/core';
import { stringToInteger } from '../core';
import { Edge, Graph, Vertex } from '../graph';
import {
	createCycleServer,
	createLiteralServer,
	createNotServer,
	createRandomGroupingServer,
	createRandomSelectionServer,
} from '../servers';
import {
	FunctionOption,
	NumbersServer,
	TinySymbolTable,
	UnexpectedError,
	VertexMap,
} from '../types';
import { LexicalPatterns } from './lexical';
import {
	EdgeConstructorParams,
	InterimEdgeConstructorParams,
	InterimEdgeConstructorParamsArray,
	InterimVertexConstructorParams,
	InterimVertexConstructorParamsMap,
	VertexConstructorParams,
} from './types';

/* eslint-disable no-mixed-spaces-and-tabs */

/**
 * Turns our little boy vertices and edges into men. And then builds the graph. Does
 * validate the integrity of references. Note: we may at some point want to be able to
 * reference other object's properties from functions. At that point we will be concerned
 * with dependencies and the order in which we build vertices. But not today.
 * @param interimVertexMap
 * @param interimEdges
 * @param symbolTable
 */
export function buildGraph(
	interimVertexMap: Readonly<InterimVertexConstructorParamsMap>,
	interimEdges: Readonly<InterimEdgeConstructorParamsArray>,
	symbolTable: Readonly<TinySymbolTable>
): Graph {
	const vertexMap = _buildVertexMap(interimVertexMap, symbolTable);
	const edges = _buildEdges(interimEdges, vertexMap, symbolTable);
	return new Graph(vertexMap, edges);
}

/***********************
 * Private Interface
 **********************/
/**
 * Takes a collection of vertex descriptions and creates big boy `Vertex`'s out of them.
 */
function _buildVertexMap(
	interimVertices: Readonly<InterimVertexConstructorParamsMap>,
	symbolTable: Readonly<TinySymbolTable>
): VertexMap {
	return Object.values(interimVertices).reduce(
		(
			accumulator: VertexMap,
			interimVertex: InterimVertexConstructorParams
		): VertexMap => {
			const params: VertexConstructorParams = {
				channel: interimVertex.channel
					? (stringToInteger(interimVertex.channel) as MidiChannelType)
					: undefined,
				name: interimVertex.name,
				notes: interimVertex.notes
					? _propertyValueToServer(interimVertex.notes, symbolTable)
					: undefined,
				pan: interimVertex.pan
					? _propertyValueToServer(interimVertex.pan, symbolTable)
					: undefined,
				velocity: interimVertex.velocity
					? _propertyValueToServer(interimVertex.velocity, symbolTable)
					: undefined,
			};
			accumulator[params.name] = new Vertex(params);
			return accumulator;
		},
		{}
	);
}

/**
 * Takes a collection of edge descriptions and creates `Edge`'s out of them.
 */
function _buildEdges(
	interimEdges: Readonly<InterimEdgeConstructorParamsArray>,
	vertexMap: Readonly<VertexMap>,
	symbolTable: Readonly<TinySymbolTable>
): Edge[] {
	return interimEdges.map((interimEdge: InterimEdgeConstructorParams): Edge => {
		const params: EdgeConstructorParams = {
			name: interimEdge.name,
			panOffset: interimEdge.panOffset
				? _propertyValueToServer(interimEdge.panOffset, symbolTable)
				: undefined,
			velocityOffset: interimEdge.velocityOffset
				? _propertyValueToServer(interimEdge.velocityOffset, symbolTable)
				: undefined,
			weight: interimEdge.weight ? stringToInteger(interimEdge.weight) : undefined,
			vertexFrom: vertexMap[interimEdge.vertexFrom],
			vertexTo: vertexMap[interimEdge.vertexTo],
		};
		if (params.vertexFrom === undefined) {
			throw new Error(
				`"${interimEdge.name}" references unknown vertex "${interimEdge.vertexFrom}"`
			);
		}
		if (params.vertexTo === undefined) {
			throw new Error(
				`"${interimEdge.name}" references unknown vertex "${interimEdge.vertexTo}"`
			);
		}
		return new Edge(params);
	});
}

/**
 * Parses the assignment and builds the R-hand server.
 * Note: we are exporting for testing
 * @param rvalue
 * @param symbols
 */
export function _propertyValueToServer(
	rvalue: string,
	symbols: Readonly<TinySymbolTable>
): NumbersServer {
	let match: string[] | null;

	/**
	 * Pick apart elements of an array
	 */
	function parseArray<T extends string>(value: string): T[] {
		return value
			.substring(1, value.length - 1)
			.trim()
			.split(/\s*,\s*/) as T[];
	}

	/**
	 * Parse an array of numbers and/or symbols into an array of numbers
	 */
	function parseAndResolveArray(value: string): number[] {
		const elements = parseArray(value);
		return elements.map(resolveValueToInteger);
	}

	/**
	 * Parse an array of symbol/number and/or Array<symbol/number>
	 */
	function parseAndResolveHybridArray(value: string): number[][] {
		let match;
		const result: number[][] = [];
		const parser = new ParseTextBuffer(value.substring(1, value.length - 1));
		while (!parser.isEnd()) {
			parser.eatWhite(/\s*,?\s*/);
			if ((match = parser.match(LexicalPatterns.NumericArray))) {
				result.push(parseAndResolveArray(match as string));
			} else if ((match = parser.match(LexicalPatterns.NumericValue))) {
				result.push([resolveValueToInteger(match as string)]);
			} else {
				throw new UnexpectedError();
			}
		}
		return result;
	}

	/**
	 * Figure out whether it's an array of single value and parse it
	 */
	function parseAndResolveObject(value: string): number | number[] {
		return value[0] === '[' ? parseAndResolveArray(value) : resolveValueToInteger(value);
	}

	function rangeOrHybridArrayToResolvedArray(array?: string, range?: string): number[][] {
		if (array) {
			return parseAndResolveHybridArray(array);
		} else if (range) {
			const irange = rangeToInterface(range);
			return _.range(irange.min, irange.max + 1).map((value) => [value]);
		} else {
			throw new UnexpectedError();
		}
	}

	function rangeToArray(value: string): number[] {
		const match = value.match(LexicalPatterns.NumericRangeGrouped);
		return _.range(stringToInteger(match![1]), stringToInteger(match![2]) + 1);
	}

	function rangeToInterface(value: string): INumericRange {
		const match = value.match(LexicalPatterns.NumericRangeGrouped);
		return {
			min: resolveValueToInteger(match![1]),
			max: resolveValueToInteger(match![2]),
		};
	}

	/**
	 * Parse a symbol or primitive value into a number
	 * @throws {Error}
	 */
	function resolveValueToInteger(value: string): number {
		const resolved = symbols.getSymbolWithDefault(value, value, true);
		return stringToInteger(resolved);
	}

	if ((match = rvalue.match(LexicalPatterns.LiteralFunction))) {
		return createLiteralServer(parseAndResolveObject(match[0]));
	} else if ((match = rvalue.match(LexicalPatterns.CycleFunction))) {
		return createCycleServer(rangeOrHybridArrayToResolvedArray(match[1], match[2]));
	} else if ((match = rvalue.match(LexicalPatterns.NotFunction))) {
		const options = match[3] ? parseArray<FunctionOption>(match[3]) : undefined;
		return createNotServer(
			parseAndResolveArray(match[1]),
			rangeToArray(match[2]),
			options
		);
	} else if ((match = rvalue.match(LexicalPatterns.RandomGroupingFunction1))) {
		return createRandomGroupingServer(
			rangeOrHybridArrayToResolvedArray(match[1], match[2]),
			rangeToInterface(match[3])
		);
	} else if ((match = rvalue.match(LexicalPatterns.RandomGroupingFunction2))) {
		return createRandomGroupingServer(
			rangeOrHybridArrayToResolvedArray(match[1], match[2]),
			rangeToInterface(match[3]),
			undefined,
			parseArray(match[4])
		);
	} else if ((match = rvalue.match(LexicalPatterns.RandomGroupingFunction3))) {
		return createRandomGroupingServer(
			rangeOrHybridArrayToResolvedArray(match[1], match[2]),
			rangeToInterface(match[3]),
			parseAndResolveArray(match[4])
		);
	} else if ((match = rvalue.match(LexicalPatterns.RandomGroupingFunction4))) {
		return createRandomGroupingServer(
			rangeOrHybridArrayToResolvedArray(match[1], match[2]),
			rangeToInterface(match[3]),
			parseAndResolveArray(match[4]),
			parseArray(match[5])
		);
	} else if ((match = rvalue.match(LexicalPatterns.RandomSelectionFunction1))) {
		return createRandomSelectionServer(
			rangeOrHybridArrayToResolvedArray(match[1], match[2])
		);
	} else if ((match = rvalue.match(LexicalPatterns.RandomSelectionFunction2))) {
		return createRandomSelectionServer(
			rangeOrHybridArrayToResolvedArray(match[1], match[2]),
			undefined,
			parseArray(match[3])
		);
	} else if ((match = rvalue.match(LexicalPatterns.RandomSelectionFunction3))) {
		return createRandomSelectionServer(
			rangeOrHybridArrayToResolvedArray(match[1], match[2]),
			parseAndResolveArray(match[3])
		);
	} else if ((match = rvalue.match(LexicalPatterns.RandomSelectionFunction4))) {
		return createRandomSelectionServer(
			rangeOrHybridArrayToResolvedArray(match[1], match[2]),
			parseAndResolveArray(match[3]),
			parseArray(match[4])
		);
	} else {
		throw new Error(`unknown function "${rvalue}"`);
	}
}
