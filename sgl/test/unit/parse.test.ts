/**
 * @license MIT (see project's LICENSE file)
 */

import { parseInput } from '../../src/parse';
import { IParsedInput } from '../../src/types';
import { directoryToDescribeTitle } from '../utils';

describe(directoryToDescribeTitle(__dirname, 'parse.ts'), function () {
	describe('parseInput', function () {
		interface IParseInputTest {
			input: string;
			output: IParsedInput;
			test: string;
		}

		const tests: IParseInputTest[] = [
			{
				input: `# this will multiply and push the result
				50 *^ 2
				# comment
				`,
				output: {
					sequences: ['50 *^ 2'],
					symbols: {},
				},
				test: 'it should eliminate comments and find a single sequence',
			},
			{
				input: `#symbols:
				elephant = 10
				giraffe  =  50
				tea 	= 	nice
				
				# the action
				elephant * giraffe
				`,
				output: {
					sequences: ['elephant * giraffe'],
					symbols: {
						elephant: '10',
						giraffe: '50',
						tea: 'nice',
					},
				},
				test: 'it should eliminate comments and find a single sequence',
			},
		];

		tests.forEach(({ input, output, test }): void => {
			it(test, function () {
				const result = parseInput(input);
				expect(result).toEqual(output);
			});
		});
	});
});
