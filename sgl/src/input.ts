/**
 * @license MIT (see project's LICENSE file)
 */

import { readFile, readStdin } from 'tiny-core-module';
import { CliOptions } from './types';

export async function readInput(
	options: Readonly<CliOptions>,
	args: ReadonlyArray<string>
): Promise<string> {
	try {
		if (args.length > 0) {
			return args[0];
		} else {
			return options.inputFile ? await readFile(options.inputFile) : await readStdin();
		}
	} catch (error) {
		throw new Error(`attempt to read failed - ${error.message}`);
	}
}
