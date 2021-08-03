/**
 * @license MIT (see project's LICENSE file)
 */

import * as path from 'path';

/**
 * Creates a dotted path relative to what would be the project's root. We like to keep
 * our test files and suites arranged in the same way as their brothers on the front line
 * @param directory
 * @param module - optionally end a module within the expectations that you may be testing
 */
export function directoryToDescribeTitle(directory: string, module = ''): string {
	const result = path.relative(path.normalize('./test/'), directory).replace(/\//g, '.');
	return module.length > 0 ? `${result}.${module}` : result;
}
