/**
 * @license MIT (see project's LICENSE file)
 */

import {
	getAllVocabularyProperties,
	getOptionalVocabularyProperties,
	getRequiredVocabularyProperties,
} from '../../../src/types';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'vocabulary'), function () {
	enum TestVocabulary {
		O1 = '*o1',
		O2 = '*o2',
		R1 = 'r1',
		R2 = 'r2',
	}

	describe('getAllVocabularyProperties', function () {
		it('should properly strip off optional prefixes and return the list', function () {
			expect(getAllVocabularyProperties(TestVocabulary)).toEqual([
				'o1',
				'o2',
				'r1',
				'r2',
			]);
		});
	});

	describe('getRequiredVocabularyProperties', function () {
		it('should properly strip off optional prefixes and return the list', function () {
			expect(getRequiredVocabularyProperties(TestVocabulary)).toEqual(['r1', 'r2']);
		});
	});

	describe('getOptionalVocabularyProperties', function () {
		it('should properly strip off optional prefixes and return the list', function () {
			expect(getOptionalVocabularyProperties(TestVocabulary)).toEqual(['o1', 'o2']);
		});
	});
});
