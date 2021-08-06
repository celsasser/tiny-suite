/**
 * @license MIT (see project's LICENSE file)
 */

import { readFile, readStdin } from '@tiny/core/src';
import { CliOptions } from './types';

export async function readInput(options: Readonly<CliOptions>): Promise<string> {
	try {
		return options.inputFile ? await readFile(options.inputFile) : await readStdin();
	} catch (error) {
		throw new Error(`attempt to read failed - ${error.message}`);
	}
}
