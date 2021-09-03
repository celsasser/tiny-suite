/**
 * @license MIT (see project's LICENSE file)
 */

import { doUntil, doWhile } from '../../../src/core';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'functional'), function () {
	describe('doUntil', function () {
		it('should execute at least once', function () {
			const predicate = jest.fn().mockReturnValue(false);
			const process = jest.fn();
			doUntil(predicate, process, 1);
			expect(process).toBeCalledWith(1, 0);
			expect(predicate).toBeCalledWith(1);
		});
	});

	describe('doWhile', function () {
		it('should not execute at least once', function () {
			const predicate = jest.fn().mockReturnValue(false);
			const process = jest.fn();
			doWhile(predicate, process, 1);
			expect(process).not.toHaveBeenCalled();
			expect(predicate).toBeCalledWith(0);
		});
	});
});
