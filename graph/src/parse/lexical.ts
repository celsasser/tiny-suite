/**
 * @license MIT (see project's LICENSE file)
 */

import { FunctionName, FunctionOption, ReservedIdentifier } from '../types';

/**
 * Library of patterns we use to identify parts of a tiny expression
 */
export class LexicalPatterns {
	/***********************
	 * Primitives
	 * Note: with primitives we for the most part avoid capture groups.
	 * Gets too crazy with the way we build up our lexical grammar. Some exceptions.
	 **********************/
	private static readonly Symbol = /[a-zA-Z$_-][0-9a-zA-Z$_-]*/;
	private static readonly Number = /\d+/;
	/**
	 * Either a symbol (assumed to represent a number) or a literal
	 */
	public static readonly NumericValue = new RegExp(
		`(?:${LexicalPatterns.Number.source}|${LexicalPatterns.Symbol.source})`
	);
	/**
	 * Array of numbers, symbols or both
	 */
	public static readonly NumericArray = new RegExp(
		`\\[\\s*${LexicalPatterns.NumericValue.source}?\\s*(?:,\\s*${LexicalPatterns.NumericValue.source}\\s*)*]`
	);
	/**
	 * Either a numeric value or a numeric array
	 */
	private static readonly NumericValueOrNumericArray = new RegExp(
		`(?:${LexicalPatterns.NumericValue.source}|${LexicalPatterns.NumericArray.source})`
	);
	private static readonly HybridArray = new RegExp(
		`\\[\\s*${LexicalPatterns.NumericValueOrNumericArray.source}?\\s*(?:,\\s*${LexicalPatterns.NumericValueOrNumericArray.source}\\s*)*]`
	);

	/**
	 * A numeric range in the form of [<from> - <to>]
	 */
	private static readonly NumericRange = new RegExp(
		`\\[\\s*${LexicalPatterns.NumericValue.source}\\s*-\\s*${LexicalPatterns.NumericValue.source}\\s*]`
	);
	public static readonly NumericRangeGrouped = new RegExp(
		`\\[\\s*(${LexicalPatterns.NumericValue.source})\\s*-\\s*(${LexicalPatterns.NumericValue.source})\\s*]`
	);

	private static readonly FunctionOption = new RegExp(
		`(?:${Object.values(FunctionOption).join('|')})`
	);
	private static readonly FunctionOptions = new RegExp(
		`\\[\\s*${LexicalPatterns.FunctionOption.source}?\\s*(?:,\\s*${LexicalPatterns.FunctionOption.source}\\s*)*]`
	);

	/***********************
	 * Grammar
	 * Note: we always assume that all leading white space has been removed and that
	 * (within our parse buffer) we are positioned at the beginning of an expression.
	 * We treat comments a little differently because we allow them to be declared
	 * inline, which you will see below is a little conflicted at the moment.
	 **********************/
	/**
	 * Current offset plus space followed or not followed by a comment, blank lines,
	 * comment lines
	 */
	public static readonly CommentsAndSpace = /^(\s*(#.*)?\n?)*/m;
	public static readonly EdgeDeclaration = new RegExp(
		`^((${LexicalPatterns.Symbol.source})\\s*->\\s*(${LexicalPatterns.Symbol.source}))\\s*:`
	);
	public static readonly VertexDeclaration = new RegExp(
		`^(${LexicalPatterns.Symbol.source})\\s*:`
	);
	public static readonly ProjectDeclaration = new RegExp(
		`^${ReservedIdentifier.Project}\\s*:`
	);
	/**
	 * Designed to pull any R-Value in minus trailing white space and comment
	 * 7/12 - regarding trailing comments, it's a problem because we want to support
	 * symbols, such as C#5 (without quoting), which slipped my mind. So we will either
	 * change our comment convention or adopt a line terminator or just not support
	 * inline comments vs. dedicated line comments
	 */
	public static readonly PropertyAssignment = /^(\w+)\s*=\s*(.+?)\s*?(?:\n|$)/;

	/***********************
	 * Function Patterns
	 **********************/
	/**
	 * spec: `cycle(elements: Array<number|string|Array<number|string>>|range)`
	 * options: string[])` Example: `cycle([1, [2, 3], 4])`
	 */
	public static readonly CycleFunction = new RegExp(
		`^${FunctionName.Cycle}\\s*\\(\\s*(?:(${LexicalPatterns.HybridArray.source})|(${LexicalPatterns.NumericRange.source}))\\s*\\)\\s*$`
	);

	/**
	 * spec: `number|number[]`
	 * Example: `5` or `[10, 12, 14]`
	 */
	public static readonly LiteralFunction = new RegExp(
		`^${LexicalPatterns.NumericValueOrNumericArray.source}\\s*$`
	);

	/**
	 * spec: `not(values: Array<number|string>, range: [\d+-\d+], options?: string[])`
	 * Example: `not([2, 4, 5], [0 - 6])`
	 */
	public static readonly NotFunction = new RegExp(
		`^${FunctionName.Not}\\s*\\(\\s*(${LexicalPatterns.NumericArray.source})\\s*,\\s*(${LexicalPatterns.NumericRange.source})\\s*(?:,\\s*(${LexicalPatterns.FunctionOptions.source})\\s*)?\\)\\s*$`
	);

	/**
	 * Generates random sets from a range of values
	 * spec: `randomGrouping(values: number[]|range, count: range)`
	 */
	public static readonly RandomGroupingFunction1 = new RegExp(
		`^${FunctionName.RandomGrouping}\\s*\\(\\s*(?:(${LexicalPatterns.HybridArray.source})|(${LexicalPatterns.NumericRange.source}))\\s*,\\s*(${LexicalPatterns.NumericRange.source})\\s*\\)\\s*$`
	);

	/**
	 * Generates random sets from a range of values
	 * spec: `randomGrouping(values: number[]|range, count: range, options: string[])`
	 * Note: we process this before the next 'cause our options could look like weights
	 */
	public static readonly RandomGroupingFunction2 = new RegExp(
		`^${FunctionName.RandomGrouping}\\s*\\(\\s*(?:(${LexicalPatterns.HybridArray.source})|(${LexicalPatterns.NumericRange.source}))\\s*,\\s*(${LexicalPatterns.NumericRange.source})\\s*,\\s*(${LexicalPatterns.FunctionOptions.source})\\s*\\)\\s*$`
	);

	/**
	 * Generates random sets from a range of values
	 * spec: `randomGrouping(values: number[]|range, count: range, weights: number[])`
	 */
	public static readonly RandomGroupingFunction3 = new RegExp(
		`^${FunctionName.RandomGrouping}\\s*\\(\\s*(?:(${LexicalPatterns.HybridArray.source})|(${LexicalPatterns.NumericRange.source}))\\s*,\\s*(${LexicalPatterns.NumericRange.source})\\s*,\\s*(${LexicalPatterns.NumericArray.source})\\s*\\)\\s*$`
	);

	/**
	 * Generates random sets from a range of values
	 * spec: `randomGrouping(values: number[]|range, count: range, weights: number[],
	 * options: string[])`
	 */
	public static readonly RandomGroupingFunction4 = new RegExp(
		`^${FunctionName.RandomGrouping}\\s*\\(\\s*(?:(${LexicalPatterns.HybridArray.source})|(${LexicalPatterns.NumericRange.source}))\\s*,\\s*(${LexicalPatterns.NumericRange.source})\\s*,\\s*(${LexicalPatterns.NumericArray.source})\\s*,\\s*(${LexicalPatterns.FunctionOptions.source})\\s*\\)\\s*$`
	);

	/**
	 * Generates random selections from a parameterized set of values
	 * spec: `randomSelection(values: Array<number|string|Array<number|string>>`
	 */
	public static readonly RandomSelectionFunction1 = new RegExp(
		`^${FunctionName.RandomSelection}\\s*\\(\\s*(?:(${LexicalPatterns.HybridArray.source})|(${LexicalPatterns.NumericRange.source}))\\s*\\)\\s*$`
	);

	/**
	 * Generates random selections from a parameterized set of values with options
	 * spec: `randomSelection(values: Array<number|string|Array<number|string>>, options:
	 * string[])`
	 * Note: we process this before the next 'cause our options could look like
	 * weights
	 */
	public static readonly RandomSelectionFunction2 = new RegExp(
		`^${FunctionName.RandomSelection}\\s*\\(\\s*(?:(${LexicalPatterns.HybridArray.source})|(${LexicalPatterns.NumericRange.source}))\\s*,\\s*(${LexicalPatterns.FunctionOptions.source})\\s*\\)\\s*$`
	);

	/**
	 * Generates random selections from a parameterized set of values with weights
	 * spec: `randomSelection(values: Array<number|string|Array<number|string>>, weights:
	 * number[])`
	 */
	public static readonly RandomSelectionFunction3 = new RegExp(
		`^${FunctionName.RandomSelection}\\s*\\(\\s*(?:(${LexicalPatterns.HybridArray.source})|(${LexicalPatterns.NumericRange.source}))\\s*,\\s*(${LexicalPatterns.NumericArray.source})\\s*\\)\\s*$`
	);

	/**
	 * Generates random selections from a parameterized set of values with all
	 * configuration options
	 * spec: `randomSelection(values: Array<number|string|Array<number|string>>, weights:
	 * number[], options: string[])`
	 */
	public static readonly RandomSelectionFunction4 = new RegExp(
		`^${FunctionName.RandomSelection}\\s*\\(\\s*(?:(${LexicalPatterns.HybridArray.source})|(${LexicalPatterns.NumericRange.source}))\\s*,\\s*(${LexicalPatterns.NumericArray.source})\\s*,\\s*(${LexicalPatterns.FunctionOptions.source})\\s*\\)\\s*$`
	);
}
