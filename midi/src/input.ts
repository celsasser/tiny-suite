import { IChannel, PolyphonicArray, readFile, readStdin } from '@tiny/core';
import { isChannelArray, isPolyphonicArray } from './schema';
import { CliOptions } from './types';

export async function getInput(options: Readonly<CliOptions>): Promise<IChannel[]> {
	try {
		const rawInput = options.inputFile
			? await readFile(options.inputFile)
			: await readStdin();
		const parsed = JSON.parse(rawInput);
		return _normalizeInput(parsed);
	} catch (error) {
		throw new Error(`attempt to read failed - ${error.message}`);
	}
}

/***********************
 * Private Interface
 **********************/
function _normalizeInput(input: unknown): IChannel[] {
	if (isPolyphonicArray(input)) {
		return _polyphonicArrayToChannel(input as PolyphonicArray);
	} else if (isChannelArray(input)) {
		return input as IChannel[];
	} else {
		throw new Error('unknown input specification');
	}
}

function _polyphonicArrayToChannel(input: PolyphonicArray): IChannel[] {
	return [
		{
			notes: input,
		},
	];
}
