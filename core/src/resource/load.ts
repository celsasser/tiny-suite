/**
 * @license MIT (see project's LICENSE file)
 */

import { readFileSync } from 'fs';
import * as hjson from 'hjson';
import { resolve } from 'path';

/********************
 * Public Interface
 ********************/
/**
 * Loads resource as a path that is relative to this module's root
 * @throws {Error} if FS or format issues
 */
export function loadModuleResource(
	relativePath: string,
	encoding: BufferEncoding = 'utf-8'
): string {
	const path = _relativeToAbsolute(relativePath);
	return readFileSync(path, { encoding });
}

/**
 * Loads resource as a `relativePath` that is relative to this module's root
 * Note: uses hjson so bring on the decorated JSON files.
 * @param relativePath
 * @throws {Error} if FS or format issues
 */
export function loadModuleJsonResource<T>(relativePath: string): T {
	const content = loadModuleResource(relativePath);
	return hjson.parse(content);
}

/********************
 * Private Interface
 ********************/
function _relativeToAbsolute(relativePath: string): string {
	return resolve(__dirname, `../../${relativePath}`);
}
