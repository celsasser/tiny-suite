/**
 * @license MIT (see project's LICENSE file)
 */

import { SymbolTable } from '../../../src';
import { RuntimeError, UnknownSymbolError } from '../../../src/types';

describe('algorithms', function () {
	describe('SymbolTable', function () {
		describe('constructor', function () {
			it('should properly create an instance', function () {
				const scope = new SymbolTable();
				expect(scope).toEqual({
					_parent: undefined,
					_table: new Map(),
				});
			});
		});

		describe('pushScope', function () {
			it('should add a scope to the top of the chain', function () {
				const bottom = new SymbolTable();
				const top = bottom.pushScope();
				expect(bottom).toEqual({
					_parent: undefined,
					_table: new Map(),
				});
				expect(top).toEqual({
					_parent: bottom,
					_table: new Map(),
				});
			});
		});

		describe('popScope', function () {
			it('should throw an error if there is no parent scope', function () {
				expect(() => new SymbolTable().popScope()).toThrow(RuntimeError);
			});

			it('should properly return the base state', function () {
				const bottom = new SymbolTable();
				const top = bottom.pushScope();
				expect(top.popScope()).toEqual(bottom);
			});
		});

		describe('addSymbol/getSymbol', function () {
			it('should properly add and retrieve a symbol symbol', function () {
				const scope = new SymbolTable();
				scope.addSymbol('super', 'george');
				expect(scope.getSymbol('super')).toEqual('george');
			});

			it('should add to topmost scope', function () {
				let scope = new SymbolTable();
				scope = scope.pushScope();
				scope.addSymbol('super', 'george');
				expect(scope.getSymbol('super')).toEqual('george');
				scope = scope.popScope();
				expect(scope.getSymbol.bind(scope, 'super')).toThrow(UnknownSymbolError);
			});

			it('getSymbol should throw an exception if key cannot be found', function () {
				const scope = new SymbolTable();
				expect(scope.getSymbol.bind(scope, 'super')).toThrow('unknown symbol super');
			});

			it('getSymbolWithDefault should get a default if not present', function () {
				const scope = new SymbolTable();
				expect(scope.getSymbolWithDefault('super', 'george')).toEqual('george');
			});

			[
				{ deepResolve: false, expected: 'BIG' },
				{ deepResolve: true, expected: '10lb' },
			].forEach(({ deepResolve, expected }) => {
				it(`should properly resolve value when deepResolve = ${deepResolve}`, function () {
					const scope = new SymbolTable();
					scope.addSymbols({
						size: 'BIG',
						BIG: '10lb',
					});
					expect(scope.getSymbol('size', deepResolve)).toEqual(expected);
					expect(scope.getSymbolWithDefault('size', null, deepResolve)).toEqual(expected);
				});
			});
		});

		describe('addSymbols', function () {
			it('should add multiple K/V pairs for index type', function () {
				const scope = new SymbolTable<number>();
				scope.addSymbols({ a: 1, b: 2 });
				expect(scope.getSymbol('a')).toEqual(1);
				expect(scope.getSymbol('b')).toEqual(2);
			});

			it('should add multiple K/V pairs for enum type', function () {
				enum Test {
					'a' = 'Alpha',
					'b' = 'Beta',
				}
				const scope = new SymbolTable<string>();
				scope.addSymbols(Test);
				expect(scope.getSymbol('a')).toEqual(Test.a);
				expect(scope.getSymbol('b')).toEqual(Test.b);
			});

			it('should add uppercase key variants', function () {
				enum Test {
					'a' = 'Alpha',
					'b' = 'Beta',
				}
				const scope = new SymbolTable<string>();
				scope.addSymbols(Test, { addUppercaseVariation: true });
				expect(scope.getSymbol('a')).toEqual(Test.a);
				expect(scope.getSymbol('A')).toEqual(Test.a);
				expect(scope.getSymbol('b')).toEqual(Test.b);
				expect(scope.getSymbol('B')).toEqual(Test.b);
			});

			it('should add lowercase key variants', function () {
				enum Test {
					'A' = 'Alpha',
					'B' = 'Beta',
				}
				const scope = new SymbolTable<string>();
				scope.addSymbols(Test, { addLowercaseVariation: true });
				expect(scope.getSymbol('a')).toEqual(Test.A);
				expect(scope.getSymbol('A')).toEqual(Test.A);
				expect(scope.getSymbol('b')).toEqual(Test.B);
				expect(scope.getSymbol('B')).toEqual(Test.B);
			});
		});
	});
});
