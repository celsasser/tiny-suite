/**
 * @license MIT (see project's LICENSE file)
 */

import { readFile, readStdin } from '@tiny/core';
import { CliOptions } from './types';

export async function readInput(options: Readonly<CliOptions>): Promise<string> {
	try {
		if (options.inputFile) {
			return await readFile(options.inputFile);
		} else {
			console.warn(`(reading from stdin)`);
			return await readStdin();
		}
	} catch (error) {
		throw new Error(`attempt to read failed - ${error.message}`);
	}
}
