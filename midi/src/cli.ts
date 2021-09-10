/**
 * @license MIT (see project's LICENSE file)
 */

import * as tiny from '@tiny/core';
import { description, version } from '../package.json';
import { channelsToMidiFormat } from './convert';
import { getInput } from './input';
import { writeOutput } from './output';
import { CliOptionNames, CliOptions } from './types';

/**
 * The orchestrator. He works with our support cast to fully process this request.
 */
export async function run({
	argv = process.argv,
}: {
	argv?: string[];
} = {}): Promise<void> {
	const program = createSpecification();
	await tiny.run({
		argv,
		callback,
		name: 'tiny-sc',
		program,
	});
}

/***********************
 * Private Interface
 **********************/
/**
 * Builds a meta command description
 */
function createSpecification(): tiny.Command {
	const midiDefaults = tiny.getMidiDefaultSymbols().values;
	return new tiny.Command()
		.version(version)
		.description(description)
		.option(`-if --${CliOptionNames.InputFile} <path>`, 'Input file')
		.option(`-of --${CliOptionNames.OutputFile} <path>`, 'Output file')
		.option(
			`-ppn --${CliOptionNames.PulsePerNote} <value>`,
			'Set the pulse-per-note. Used when there is no `duration` information in the input data',
			midiDefaults.ppq
		)
		.option(
			`-ppq --${CliOptionNames.PulsePerQuarter} <value>`,
			'Set the pulse-per-quarter',
			midiDefaults.ppq
		)
		.option(`-t --${CliOptionNames.Tempo} <value>`, 'Set the tempo', '120')
		.option(
			`-v --${CliOptionNames.Velocity} <value>`,
			'Set the default note velocity',
			midiDefaults.velocity
		);
}

async function callback(options: Readonly<CliOptions>): Promise<void> {
	const channels = await getInput(options);
	const song = channelsToMidiFormat(options, channels);
	await writeOutput(song, options);
}
