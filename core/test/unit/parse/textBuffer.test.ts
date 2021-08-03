/**
 * @license MIT (see project's LICENSE file)
 */

import { ParseTextBuffer } from '../../../src';

describe('ParseTextBuffer', function () {
	describe('constructor', function () {
		it('should properly setup instance', function () {
			const buffer = new ParseTextBuffer('1 2 3');
			expect(buffer).toEqual({
				_buffer: '1 2 3',
				_offset: 0,
			});
		});

		it('should prep and strip the buffer if asked to', function () {
			const buffer = new ParseTextBuffer('1 2 3', {
				strip: true,
			});
			expect(buffer).toEqual({
				_buffer: '123',
				_offset: 0,
			});
		});
	});

	describe('remainder', function () {
		it('should return the whole buffer upon construction', function () {
			const buffer = new ParseTextBuffer('12');
			expect(buffer.remainder).toEqual('12');
		});

		it('should return the remainder when offset > 0', function () {
			const buffer = new ParseTextBuffer('12');
			expect(buffer.remainder).toEqual('12');
			buffer.rollback(1);
			expect(buffer.remainder).toEqual('2');
		});
	});

	describe('eatWhite', function () {
		it('should not move offset if no white space', function () {
			const buffer = new ParseTextBuffer('1');
			buffer.eatWhite();
			expect(buffer.offset).toEqual(0);
		});

		it('should move offset for spaces', function () {
			const buffer = new ParseTextBuffer(' 1');
			buffer.eatWhite();
			expect(buffer.offset).toEqual(1);
		});

		it('should move offset for tabs', function () {
			const buffer = new ParseTextBuffer('\t1');
			buffer.eatWhite();
			expect(buffer.offset).toEqual(1);
		});
	});

	describe('isEOB', function () {
		it('should return false if offset is not at the end', function () {
			const buffer = new ParseTextBuffer('1');
			expect(buffer.isEnd()).toEqual(false);
		});

		it('should return true if offset is at the end', function () {
			const buffer = new ParseTextBuffer('');
			expect(buffer.isEnd()).toEqual(true);
		});

		it('should return true if pattern matches remainder', function () {
			const buffer = new ParseTextBuffer(' ');
			expect(buffer.isEnd()).toEqual(true);
		});
	});

	describe('match', function () {
		describe('literal input', function () {
			it('should return null if match fails', function () {
				const buffer = new ParseTextBuffer('12');
				expect(buffer.match('2')).toEqual(null);
				expect(buffer.offset).toEqual(0);
			});

			it('should return string value if match passes', function () {
				const buffer = new ParseTextBuffer('12');
				expect(buffer.match('1')).toEqual('1');
				expect(buffer.offset).toEqual(1);
			});

			it('should return null if match with offset > 0 fails', function () {
				const buffer = new ParseTextBuffer('12', {
					offset: 1,
				});
				expect(buffer.match('1')).toEqual(null);
				expect(buffer.offset).toEqual(1);
			});

			it('should return value if match passes with offset > 0', function () {
				const buffer = new ParseTextBuffer('12', {
					offset: 1,
				});
				expect(buffer.match('2')).toEqual('2');
				expect(buffer.offset).toEqual(2);
			});
		});

		describe('regex input', function () {
			it('should return null if match fails', function () {
				const buffer = new ParseTextBuffer('a1');
				expect(buffer.match(/\d/)).toEqual(null);
				expect(buffer.offset).toEqual(0);
			});

			it('should return string value if match passes', function () {
				const buffer = new ParseTextBuffer('a1');
				expect(buffer.match(/[a-z]/)).toEqual('a');
				expect(buffer.offset).toEqual(1);
			});

			it('should return string[] value if match with match groups passes', function () {
				const buffer = new ParseTextBuffer('a1');
				expect(buffer.match(/([a-z])([0-9])/)).toEqual(['a', '1']);
				expect(buffer.offset).toEqual(2);
			});

			it('should return null if match with offset > 0 fails', function () {
				const buffer = new ParseTextBuffer('a1', {
					offset: 1,
				});
				expect(buffer.match(/[a-z]/)).toEqual(null);
				expect(buffer.offset).toEqual(1);
			});

			it('should return value if match passes with offset > 0', function () {
				const buffer = new ParseTextBuffer('a1', {
					offset: 1,
				});
				expect(buffer.match(/\d/)).toEqual('1');
				expect(buffer.offset).toEqual(2);
			});

			it('should not break if we beginning of line marker', function () {
				const buffer = new ParseTextBuffer('a1');
				expect(buffer.match(/^[a-z]/)).toEqual('a');
				expect(buffer.offset).toEqual(1);
			});
		});
	});

	/**
	 * We are not going to aggressively test this guy 'cause we know it
	 * shares the same functionality as `match`
	 */
	describe('peek', function () {
		it('should return null if match could not be made', function () {
			const buffer = new ParseTextBuffer('12');
			expect(buffer.peek('2')).toEqual(null);
			expect(buffer.offset).toEqual(0);
		});

		it('should return value if match succeeds but offset should not change', function () {
			const buffer = new ParseTextBuffer('12');
			expect(buffer.peek('1')).toEqual('1');
			expect(buffer.offset).toEqual(0);
		});
	});
});
