/**
 * @license MIT (see project's LICENSE file)
 */

export class RuntimeError extends Error {
	constructor(problem: string) {
		super(`runtime error - ${problem}`);
	}
}

export class UnexpectedError extends Error {
	constructor(message?: string) {
		super(message ? message : 'unexpected error');
	}
}
/**
 * Reference to symbol that is not in a symbol table.
 */
export class UnknownSymbolError extends Error {
	constructor(symbolName: string) {
		super(`unknown symbol ${symbolName}`);
	}
}
