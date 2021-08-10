/**
 * @license MIT (see project's LICENSE file)
 */

export class NotImplemented extends Error {
	constructor(message: string = 'not implemented') {
		super(message);
	}
}

export class RuntimeError extends Error {
	constructor(problem: string) {
		super(`runtime error - ${problem}`);
	}
}

export class UnexpectedError extends Error {
	constructor(message: string = 'unexpected error') {
		super(message);
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
