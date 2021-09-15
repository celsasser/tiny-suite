/**
 * @license MIT (see project's LICENSE file)
 */

import { directoryToDescribeTitle, filterTests, ITest } from '@tiny/core';
import * as fs from 'fs-extra';
import { run } from '../../src/cli';
import * as tests from './cli/tests.json';

interface ICliTest extends ITest {
	argv: string[];
	exit?: number;
	output?: any;
	text: string;
}

describe(directoryToDescribeTitle(__dirname, 'cli'), function () {
	beforeEach(function () {
		jest.spyOn(fs, 'write');
		// having some issues stubbing writeChannelOutput
		jest.spyOn(process, 'exit').mockImplementation();
	});

	filterTests<ICliTest>(tests).forEach((test) => {
		it(test.text, async function () {
			await run(test.argv);
			expect(process.exit).toBeCalledWith(test.exit || 0);
			if (test.output) {
				expect(fs.write).toBeCalledWith(1, JSON.stringify(test.output));
			}
		});
	});
});
