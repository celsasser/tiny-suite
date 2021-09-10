/**
 * @license MIT (see project's LICENSE file)
 */

import * as assert from 'assert';
import * as _ from 'lodash';
import { Bearing } from '../types';

/**
 * Asserts values in `bearings`
 * @param domain - how is it being used
 * @param supported - what are the supported bearings
 * @param bearings - what are the bearings we are testing
 * @throws {Error} if unsupported bearings are included in `bearings`
 */
export function assertBearingsSupported(
	domain: string,
	supported: ReadonlyArray<Bearing>,
	bearings?: ReadonlyArray<Bearing>
): void {
	assert(
		_.difference(bearings, supported).length === 0,
		`unsupported ${domain} bearings in ${bearings}`
	);
}
