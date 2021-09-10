import { getInput } from '../../src/input';
import { CliOptionNames, CliOptions } from '../../src/types';

describe('input', function () {
	describe('getInput', function () {
		it('should properly read a monophonicArray from a file', async function () {
			const options = {
				[CliOptionNames.InputFile]: './test/res/monophonicArray.json',
			} as CliOptions;
			return expect(getInput(options)).resolves.toEqual([
				{
					notes: require('../res/monophonicArray.json'),
				},
			]);
		});
	});
});
