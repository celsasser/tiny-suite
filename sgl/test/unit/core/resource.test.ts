/**
 * @license MIT (see project's LICENSE file)
 */

import { readFileSync } from 'fs';
import { loadModuleJsonResource, loadModuleResource } from '../../../src/core/resource';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'load.ts'), function () {
	describe('loadModuleResource', function () {
		it('should properly find a test resource relative to our root', function () {
			const result = loadModuleResource('./.eslintignore');
			expect(result).toEqual(readFileSync('./.eslintignore', { encoding: 'utf-8' }));
		});

		it('should throw an exception if the resource cannot be located', function () {
			expect(loadModuleResource.bind(null, './res/symbols/dne.json')).toThrowError();
		});
	});

	describe('loadModuleJsonResource', function () {
		it('should properly find a test resource relative to our root', function () {
			const result = loadModuleJsonResource('./res/symbols/core.json');
			expect(result).toEqual(require('../../../res/symbols/core.json'));
		});

		it('should throw an exception if the resource cannot be located', function () {
			expect(loadModuleJsonResource.bind(null, './res/symbols/dne.json')).toThrowError();
		});
	});
});
