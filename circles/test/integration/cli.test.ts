/**
 * @license MIT (see project's LICENSE file)
 */

import { directoryToDescribeTitle, filterTests, ITest } from '@tiny/core';
import { run } from '../../src/cli';
import * as output from '../../src/output';
import * as tests from './cli/tests.json';

interface ICliTest extends ITest {
	argv: string[];
	exit?: number;
	output?: any;
	text: string;
}

describe(directoryToDescribeTitle(__dirname, 'cli'), function () {
	let writeOutput: jest.SpyInstance;

	beforeEach(function () {
		writeOutput = jest.spyOn(output, 'writeOutput');
		jest.spyOn(process, 'exit').mockImplementation();
	});

	filterTests<ICliTest>(tests).forEach((test) => {
		const inputFile = test.argv.join().match(/input\d+\.txt/);
		it(`${inputFile}: ${test.text}`, async function () {
			await run(test.argv);
			expect(process.exit).toBeCalledWith(test.exit || 0);
			if (test.output) {
				expect(writeOutput.mock.calls[0][0]).toEqual(test.output);
			}
		});
	});
});
