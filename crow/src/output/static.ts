/**
 * @license MIT (see project's LICENSE file)
 */

import { IChannel, writeJsonToPath, writeStdout } from '@tiny/core';
import { CliOptions } from '../types';

/**
 * Writes generated sequence to stdout or to a file
 * @param data
 * @param options
 */
export async function writeStaticOutput(
	data: ReadonlyArray<IChannel>,
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
