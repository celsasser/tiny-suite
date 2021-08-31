/**
 * Date: 12/9/19
 */

import {
	midiOffsetToPulseCount,
	midiTimesignatureToPulsesPerBeat,
} from '../../../src/midi';
import { TimeSignature } from '../../../src/types';
import { directoryToDescribeTitle } from '../../utils';

describe(directoryToDescribeTitle(__dirname, 'meter.ts'), function () {
	describe('midiOffsetToPulseCount', function () {
		require('./expect/midiOffsetToPulseCount.json').forEach(
			(test: {
				expected: number;
				offset: any;
				ppq: number;
				timesignature: TimeSignature;
			}) => {
				it(`should return ${test.expected} for meter=${test.offset}, ppq=${test.ppq}, timesignature=${test.timesignature}`, function () {
					const result = midiOffsetToPulseCount(
						test.offset,
						test.timesignature,
						test.ppq
					);
					expect(result).toStrictEqual(test.expected);
				});
			}
		);
	});

	describe('timesignatureToPulsesPerBeat', function () {
		[
			{
				expected: 240,
				ppq: 240,
				timesignature: {
					denominator: 4,
					numerator: 4,
				},
			},
			{
				expected: 960,
				ppq: 480,
				timesignature: {
					denominator: 2,
					numerator: 4,
				},
			},
			{
				expected: 480,
				ppq: 480,
				timesignature: {
					denominator: 4,
					numerator: 4,
				},
			},
			{
				expected: 240,
				ppq: 480,
				timesignature: {
					denominator: 8,
					numerator: 4,
				},
			},
		].forEach(({ expected, ppq, timesignature }) => {
			it(`should return ${expected} for ppq=${ppq}, timesignature=${timesignature}`, function () {
				const result = midiTimesignatureToPulsesPerBeat(timesignature, ppq);
				expect(result).toStrictEqual(expected);
			});
		});
	});
});
