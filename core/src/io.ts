/**
 * @license MIT (see project's LICENSE file)
 *
 * Convenience wrappers so that we don't need stdin and fs-extra elsewhere
 */

import * as fs from 'fs-extra';
import * as getStdin from 'get-stdin';

/***********************
 * Public Interface
 **********************/
export async function readStdin(): Promise<string> {
	const buffer = await getStdin();
	return buffer.toString();
}

export async function readFile(path: string, encoding = 'utf-8'): Promise<string> {
	return fs.readFile(path, { encoding });
}

export async function readJsonFromPath(
	path: string,
	options?: fs.ReadOptions
): Promise<any> {
	return fs.readJson(path, options);
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
