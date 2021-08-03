import * as tinyCoreModule from 'tiny-core-module';
import { channelsToMidiFormat } from './convert';
import { getInput } from './input';
import { writeOutput } from './output';
import { CliOptionNames, CliOptions } from './types';
import { description, version } from '../package.json';

/**
 * The orchestrator. He works with our support cast to fully process this request.
 * And he manages the exit code and reporting if any is required
 */
export async function cli({
	argv = process.argv,
}: {
	argv?: string[];
} = {}): Promise<void> {
	const program = createSpecification();
	await tinyCoreModule.run({
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
function createSpecification(): tinyCoreModule.Command {
	return new tinyCoreModule.Command()
		.version(version)
		.description(description)
		.option(`-if --${CliOptionNames.InputFile} <path>`, 'Input file')
		.option(`-of --${CliOptionNames.OutputFile} <path>`, 'Output file')
		.option(
			`-ppn --${CliOptionNames.PulsePerNote} <value>`,
			'Set the pulse-per-note',
			'480'
		)
		.option(
			`-ppq --${CliOptionNames.PulsePerQuarter} <value>`,
			'Set the pulse-per-quarter',
			'480'
		)
		.option(`-t --${CliOptionNames.Tempo} <value>`, 'Set the tempo', '120')
		.option(
			`-v --${CliOptionNames.Velocity} <value>`,
			'Set the default note velocity',
			'84'
		);
}

async function callback(options: CliOptions): Promise<void> {
	const channels = await getInput(options);
	const song = channelsToMidiFormat(options, channels);
	await writeOutput(song, options);
}
