/**
 * Date: 12/8/19
 * Time: 2:03 AM
 * @license MIT (see project's LICENSE file)
 */

import {
	getNoteIntervalSymbols,
	getNoteNameSymbols,
	StringKeyedObject,
} from '@tiny/core';
import * as vm from 'vm';

const coreApiMap: Readonly<StringKeyedObject> = _getCoreApi();

/**
 * Runs script in a context created by combining a core group of properties
 * with `dynamicProperties`
 * @throws {Error}
 */
export function runScript(
	script: string,
	dynamicProperties: StringKeyedObject = {}
): any {
	try {
		const context = _buildContext(dynamicProperties);
		return vm.runInContext(script, context);
	} catch (error) {
		throw new Error(`attempt to run script failed: ${error.message}`);
	}
}

/***********************
 * Private Interface
 **********************/
/**
 * Builds the context in which script will run
 */
function _buildContext(dynamicProperties: StringKeyedObject): vm.Context {
	const sandbox = {
		...coreApiMap,
		...dynamicProperties,
	};
	return vm.createContext(sandbox);
}

/**
 * Just the core objects. We will fold the more dynamic properties in
 * as needed
 */
export function _getCoreApi(): Readonly<StringKeyedObject> {
	const map = {
		...getNoteIntervalSymbols().values,
		...getNoteNameSymbols().values,
	};
	Object.getOwnPropertyNames(Math).reduce<StringKeyedObject>(
		(accumulator, key): StringKeyedObject => {
			accumulator[key] = (Math as StringKeyedObject)[key];
			return accumulator;
		},
		map
	);
	return map;
}
