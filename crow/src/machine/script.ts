/**
 * Date: 12/8/19
 * Time: 2:03 AM
 * @license MIT (see project's LICENSE file)
 */

import { StringKeyedObject } from '@tiny/core';
import * as vm from 'vm';
import { IState } from '../types';

/**
 * Runs script in a context created by combining a core group of properties
 * with `dynamicProperties`
 * @throws {Error}
 */
export function runScript(script: string, state: IState): number | number[] {
	try {
		const context = _buildContext(state);
		return vm.runInContext(script, context);
	} catch (error) {
		throw new Error(`attempt to process the matrix failed: ${error.message}`);
	}
}

/***********************
 * Private Interface
 **********************/
/**
 * Builds the context in which script will run
 */
function _buildContext(sandbox: Readonly<StringKeyedObject>): vm.Context {
	const proxy = _proxySandbox(sandbox);
	return vm.createContext(proxy);
}

function _proxySandbox(sandbox: Readonly<StringKeyedObject>): StringKeyedObject {
	return new Proxy<StringKeyedObject>(sandbox, {
		get: (target: StringKeyedObject, property: string): any => {
			if (!target.hasOwnProperty(property)) {
				throw new Error(`unknown symbol "${property}"`);
			}
			return target[property];
		},
	});
}
