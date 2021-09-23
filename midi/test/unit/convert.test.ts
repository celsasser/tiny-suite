import { channelsToMidiFormat } from '../../src/convert';
import { CliOptions } from '../../src/types';
import * as channelsToMidiFormatTests from './expect/channelsToMidiFormat.json';
import { IChannel } from '@tiny/core';

describe('convert', function () {
	describe('channelsToMidiFormat', function () {
		channelsToMidiFormatTests.forEach(function ({ input, output, text }) {
			it(text, function () {
				const result = channelsToMidiFormat(
					input.options as unknown as Readonly<CliOptions>,
					input.channels as IChannel[]
				);
				expect(result).toEqual(output);
			});
		});
	});
});
