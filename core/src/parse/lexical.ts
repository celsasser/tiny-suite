/**
 * @license MIT (see project's LICENSE file)
 */

/**
 * Some local patterns
 */
export class LexicalParsePatterns {
	public static readonly ArrayElements = /^\[\s*(.+?)\s*]$/;
	public static readonly BooleanValue = /^(true)|(false)|(\d+)$/i;
	public static readonly ElementSplit = /\s*,\s*/;
}
