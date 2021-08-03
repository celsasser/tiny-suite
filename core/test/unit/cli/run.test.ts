import { Command } from 'commander';
import { run } from '../../../src/cli/run';

describe('cli', function () {
	describe('run', function () {
		it('should callback with parsed args and options', async function () {
			const callback = jest.fn().mockResolvedValue(undefined);
			// @ts-expect-error - fussy devil
			process.exit = jest.fn();
			expect(
				run({
					argv: ['a', 'b', 'c'],
					callback,
					name: 'test',
					program: new Command(),
				})
			).resolves.toEqual(undefined);
		});
	});
});
