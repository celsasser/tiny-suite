import { readFileSync } from 'fs';
import { readInput } from '../../src/input';
import { CliOptionNames, CliOptions } from '../../src/types';

describe('input', function () {
	describe('readInput', function () {
		it('should read from file if `inputFile` specified', async function () {
			const filePath = `${__dirname}/expect/input1.txt`;
			const options = {
				[CliOptionNames.InputFile]: filePath,
			} as CliOptions;
			return expect(readInput(options)).resolves.toEqual(
				readFileSync(filePath, { encoding: 'utf-8' })
			);
		});
	});
});
