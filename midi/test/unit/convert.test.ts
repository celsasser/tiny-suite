import { channelsToMidiFormat } from '../../src/convert';
import { CliOptions } from '../../src/types';
import * as channelsToMidiFormatTests from './expect/channelsToMidiFormat.json';

describe('convert', function () {
	describe('channelsToMidiFormat', function () {
		channelsToMidiFormatTests.forEach(function ({ input, output, text }) {
			it(text, function () {
				const result = channelsToMidiFormat(
					input.options as unknown as Readonly<CliOptions>,
					input.channels
				);
				expect(result).toEqual(output);
			});
		});
	});
});
