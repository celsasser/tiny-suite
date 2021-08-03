/**
 * @license MIT (see project's LICENSE file)
 */

import { generateTinySequence } from '../../../src/language/';

describe('generateTinySequence', function () {
	it('should properly generate a very simple sequence', function () {
		const result = generateTinySequence('50 +^ 5');
		expect(result).toEqual([55]);
	});
});
