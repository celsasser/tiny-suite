/**
 * @license MIT (see project's LICENSE file)
 */

/**
 * A buffer that has support for examining and matching and managing an offset
 */
export class ParseTextBuffer {
	private _buffer: string;
	/**
	 * Our current pointer within the buffer
	 * @private
	 */
	private _offset: number;

	/**
	 * Create a new instance ParseBuffer.
	 */
	constructor(
		buffer: string,
		{
			offset = 0,
			strip = false,
		}: {
			offset?: number;
			strip?: boolean;
		} = {}
	) {
		this._buffer = strip ? buffer.replace(/\s+/g, '') : buffer;
		this._offset = offset;
	}

	/********************
	 * Public Accessors
	 ********************/
	/**
	 * Gets the current parse offset within the buffer
	 */
	public get offset(): number {
		return this._offset;
	}

	/**
	 * Returns the unparsed portion of the buffer
	 */
	public get remainder(): string {
		return this._buffer.substr(this._offset);
	}

	/********************
	 * Public Interface
	 ********************/
	/**
	 * Moves `this.offset` to the next non-white offset
	 */
	public eatWhite(pattern = /\s*/): void {
		this.match(pattern);
	}

	/**
	 * Are we effectively at the end of the buffer?
	 */
	public isEnd(pattern = /^\s*$/): boolean {
		return pattern.test(this.remainder);
	}

	/**
	 * Search as per <param>pattern</param>. If matched then the internal offset is advanced.
	 * @returns null if no match, string if no match groups in <param>pattern</param> otherwise string[]
	 */
	public match(pattern: string | RegExp): string | string[] | null {
		const result = this._peek(pattern);
		if (result === null) {
			return result;
		} else {
			this._offset += result[0].length;
			// if there were matching groups then the whole enchilada goes back otherwise we simplify the result
			return result.length === 1 ? result[0] : result.slice(1);
		}
	}

	/**
	 * Search as per <param>pattern</param>. The internal offset is not advanced.
	 * @returns null if no match, string if it's single match with no match groups (or one match group)
	 * 	or an array of string matching the number of array-groups
	 */
	public peek(pattern: string | RegExp): string | string[] | null {
		const result = this._peek(pattern);
		if (result === null) {
			return result;
		} else {
			// if there were matching groups then the whole enchilada goes back otherwise we simplify the result
			return result.length === 1 ? result[0] : result.slice(1);
		}
	}

	/**
	 * Rolls back to a prior offset. Technically you are setting the offset. But
	 * the theory behind the method is that one can rollback to a prior offset
	 */
	public rollback(offset: number): void {
		this._offset = offset;
	}

	/**
	 * Searches for the pattern and returns the offset if found and -1 if not found
	 * @param pattern
	 * @param eat - move current offset to the end of the match
	 * @param move - move current offset
	 * @param offset - optional starting offset. Defaults to current offset
	 */
	public search(
		pattern: string | RegExp,
		{
			eat = false,
			move = true,
			offset,
		}: {
			eat?: boolean;
			move?: boolean;
			offset?: number;
		} = {}
	): number | undefined {
		let result: number | undefined;
		const buffer = this._buffer.substr(offset || this._offset);
		const match = buffer.match(pattern);
		if (match) {
			result = match.index;
			if (eat) {
				result! += match[0].length;
			}
			if (move) {
				this._offset = result!;
			}
		}
		return result;
	}

	/**
	 * Returns the whole buffer
	 */
	public toString(): string {
		return this._buffer;
	}

	/********************
	 * Private Interface
	 ********************/
	private _peek(pattern: string | RegExp): string[] | null {
		const apply = (regex: RegExp): string[] | null => {
			const result = this.remainder.match(regex);
			// we use Array.from to strip the regex stuff out of the array
			return result !== null ? Array.from(result) : result;
		};

		// We need for this pattern to match from the start of the test buffer.
		// If they did not included it them we do.
		if (typeof pattern === 'string') {
			return apply(new RegExp(`^${pattern}`));
		} else {
			if (pattern.source[0] !== '^') {
				// we wrap this guy in a group and then strip it off so that we don't fail on alternation
				const result = apply(new RegExp(`^(${pattern.source})`, pattern.flags));
				return result !== null ? result.slice(1) : result;
			} else {
				return apply(pattern);
			}
		}
	}
}
