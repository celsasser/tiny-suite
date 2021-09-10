/**
 * @license MIT (see project's LICENSE file)
 */

class StatusCodeError extends Error {
	public readonly statusCode: number;
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

export class NotImplemented extends StatusCodeError {
	constructor(message = 'not implemented') {
		super(message, 501);
	}
}

export class NotFound extends StatusCodeError {
	constructor(objectName: string) {
		super(`not found (404) - ${objectName}`, 404);
	}
}

export class RuntimeError extends StatusCodeError {
	constructor(problem: string, statusCode = 500) {
		super(`runtime error - ${problem}`, statusCode);
	}
}

export class UnexpectedError extends StatusCodeError {
	constructor(message = 'unexpected error', statusCode = 500) {
		super(message, statusCode);
	}
}
/**
 * Reference to symbol that is not in a symbol table.
 */
export class UnknownSymbolError extends StatusCodeError {
	constructor(symbolName: string) {
		super(`unknown symbol ${symbolName}`, 404);
	}
}
