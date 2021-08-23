/**
 * @license MIT (see project's LICENSE file)
 */

import { readFile } from '@tiny/core';
import { CliOptions } from './types';

export async function readInput(
	options: Readonly<CliOptions>,
	args: ReadonlyArray<string> = []
): Promise<string> {
	try {
		if (args.length > 0) {
			return await readFile(args[0]);
		} else if (options.inputFile) {
			return await readFile(options.inputFile);
		} else {
			return await readInput();
		}
	} catch (error) {
		throw new Error(`attempt to read failed - ${error.message}`);
	}
}
