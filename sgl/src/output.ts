/**
 * @license MIT (see project's LICENSE file)
 */
import { writeJsonToPath, writeStdout } from '@tiny/core';
import { CliOptions, TinyEvaluateSequence } from './types';

/**
 * Writes generated sequence to stdout or to a file
 * @param data
 * @param options
 */
export async function writeOutput(
	data: Readonly<TinyEvaluateSequence>,
	options: Readonly<CliOptions>
): Promise<void> {
	try {
		if (options.outputFile) {
			await writeJsonToPath(options.outputFile, data);
		} else {
			await writeStdout(JSON.stringify(data));
		}
	} catch (error) {
		throw new Error(`attempt to write failed: ${error.message}`);
	}
}
