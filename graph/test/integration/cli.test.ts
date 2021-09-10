/**
 * @license MIT (see project's LICENSE file)
 */

import * as tiny from '@tiny/core';
import { run } from '../../src/cli';
import * as tests from './cli/tests.json';

interface ICliTest extends tiny.ITest {
	argv: string[];
	exit?: number;
	output?: any;
	text: string;
}

describe(tiny.directoryToDescribeTitle(__dirname, 'cli'), function () {
	let writeOutput: jest.SpyInstance;

	beforeEach(function () {
		writeOutput = jest.spyOn(tiny, 'writeChannelOutput');
		jest.spyOn(process, 'exit').mockImplementation();
	});

	tiny.filterTests<ICliTest>(tests).forEach((test) => {
		it(test.text, async function () {
			await run(test.argv);
			expect(process.exit).toBeCalledWith(test.exit || 0);
			if (test.output) {
				expect(writeOutput.mock.calls[0][0]).toEqual(test.output);
			}
		});
	});
});
