import { isChannelArray, isMonophonicArray, isPolyphonicArray } from '../../src/schema';
import {
	createChannelArray,
	createTestMonophonicArray,
	createTestPolyphonicArray,
} from '../factory/input';

describe('schema', function () {
	describe('isMonophonicArray', function () {
		it('should properly validate a number array', function () {
			const input = createTestMonophonicArray();
			expect(isMonophonicArray(input)).toEqual(true);
		});

		it('should fail with a non number array', function () {
			const input = ['a', 'b', 'c'];
			expect(isMonophonicArray(input)).toEqual(false);
		});
	});

	describe('isPolyphonicArray', function () {
		it('should properly validate a number array', function () {
			const input = createTestPolyphonicArray();
			expect(isPolyphonicArray(input)).toEqual(true);
		});

		it('should fail with a non number array', function () {
			const input = [['a', 'b']];
			expect(isPolyphonicArray(input)).toEqual(false);
		});
	});

	describe('isChannelArray', function () {
		it('should properly validate a number array', function () {
			const input = createChannelArray();
			expect(isChannelArray(input)).toEqual(true);
		});

		it('should fail with a non number array', function () {
			const input = [{}];
			expect(isChannelArray(input)).toEqual(false);
		});
	});
});
