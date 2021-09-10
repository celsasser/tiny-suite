/**
 * @license MIT (see project's LICENSE file)
 *
 * Convenience wrappers so that we don't need stdin and fs-extra elsewhere
 */

import * as fs from 'fs-extra';
import * as getStdin from 'get-stdin';
import { IChannel } from './types';

/***********************
 * Read API
 **********************/
export async function readFile(path: string, encoding = 'utf-8'): Promise<string> {
	return fs.readFile(path, { encoding });
}

export async function readJsonFromPath(
	path: string,
	options?: fs.ReadOptions
): Promise<any> {
	return fs.readJson(path, options);
}

/**
 * Reads from stdin
 * @param warn - warns user that we are reading from stdin.
 */
export async function readStdin(warn = true): Promise<string> {
	if (warn) {
		console.warn(`(reading from stdin)`);
	}
	const buffer = await getStdin();
	return buffer.toString();
}

/***********************
 * Write API
 **********************/
/**
 * Writes generated sequence to stdout or to a file
 * @param data
 * @param outputFile - if specified then written to file otherwise written to stdout
 */
export async function writeChannelOutput(
	data: ReadonlyArray<IChannel>,
	outputFile?: string
): Promise<void> {
	try {
		if (outputFile) {
			await writeJsonToPath(outputFile, data);
		} else {
			await writeStdout(JSON.stringify(data));
		}
	} catch (error) {
		throw new Error(`attempt to write failed: ${error.message}`);
	}
}

export async function writeJsonToPath<T = unknown>(
	path: string,
	data: T,
	options?: fs.WriteOptions
): Promise<void> {
	await fs.writeJSON(path, data, options);
}

export async function writeStdout(buffer: string | Readonly<Buffer>): Promise<void> {
	await fs.write(process.stdout.fd, buffer);
}

export async function writeToPath<T = unknown>(
	path: string,
	data: T,
	options?: fs.WriteOptions
): Promise<void> {
	await fs.writeFile(path, data, options);
}
