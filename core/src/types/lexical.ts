/**
 * @license MIT (see project's LICENSE file)
 */

import { ReservedIdentifier } from './vocabulary';

/**
 * Some local patterns
 */
export class LexicalPatterns {
	/***********************
	 * Private Primitives
	 * Note: with primitives we for the most part avoid capture groups.
	 * Gets too crazy with the way we build up our lexical grammar. Some exceptions.
	 **********************/
	private static readonly _Number = /\d+/;

	/***********************
	 * Public Primitives
	 **********************/
	/**
	 * Includes a capture group to get a trimmed copy of the cream
	 * in the donut array.
	 */
	public static readonly ArrayContents = /^\[\s*(.+?)\s*]$/;
	public static readonly BooleanValue = /^(true)|(false)|(\d+)$/i;

	/**
	 * Either a symbol (assumed to represent a number) or a literal
	 */
	public static readonly NumericValue = LexicalPatterns._Number;
	/**
	 * Array of numbers, symbols or both. No capture groups. Matches the entire array definition.
	 */
	public static readonly NumericArray = new RegExp(
		`\\[\\s*${LexicalPatterns.NumericValue.source}?\\s*(?:,\\s*${LexicalPatterns.NumericValue.source}\\s*)*]`
	);
	/**
	 * Either a numeric value or a numeric array
	 */
	public static readonly NumericValueOrNumericArray = new RegExp(
		`(?:${LexicalPatterns.NumericValue.source}|${LexicalPatterns.NumericArray.source})`
	);
	public static readonly Symbol = /[a-zA-Z$_-][0-9a-zA-Z$_-]*/;
	public static readonly TimeSignature = /(\d+)\s*\/\s*(\d+)/;

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
	public static readonly CommentsAndSpace = /(?:\s*(?:#.*)?\n?)*/m;

	/***********************
	 * INI file patterns
	 **********************/
	public static readonly IniProjectDeclaration = new RegExp(
		`^(${ReservedIdentifier.Project})\\s*:${LexicalPatterns.CommentsAndSpace.source}`
	);
	public static readonly IniSymbolDeclaration = new RegExp(
		`^(${LexicalPatterns.Symbol.source})\\s*:${LexicalPatterns.CommentsAndSpace.source}`
	);
	/**
	 * Designed to pull any R-Value in minus trailing white space and comment
	 * 7/12 - regarding trailing comments, it's a problem because we want to support
	 * symbols, such as C#5 (without quoting), which slipped my mind. So we will either
	 * change our comment convention or adopt a line terminator or just not support
	 * inline comments vs. dedicated line comments
	 */
	public static readonly IniPropertyAssignment = new RegExp(
		`${LexicalPatterns.CommentsAndSpace.source}(\\w+)\\s*=\\s*(.+?)\\s*?(?:\\n|$)`
	);
}
