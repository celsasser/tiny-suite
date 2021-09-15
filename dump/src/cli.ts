/**
 * @license MIT (see project's LICENSE file)
 */

import * as tiny from '@tiny/core';
import * as _ from 'lodash';
import * as midiFileIo from 'midi-file-io';

import { description, version } from '../package.json';
import { readInput } from './input';
import { writeOutput } from './output';
import { CliFormatTypes, CliOptionNames, CliOptions } from './types';

/**
 * The orchestrator. He works with our support cast to fully process this request.
 */
export async function run(argv: string[] = process.argv): Promise<void> {
	const program = createSpecification();
	await tiny.run({
		argv,
		callback,
		name: 'tiny-dump',
		program,
	});
}

/***********************
 * Private Interface
 **********************/
/**
 * Builds a command description
 */
function createSpecification(): tiny.Command {
	return new tiny.Command()
		.version(version)
		.description(description)
		.addOption(
			new tiny.CommanderOption(
				`-if --${CliOptionNames.InputFile} <path>`,
				'Input file. Defaults to stdin.'
			)
		)
		.addOption(
			new tiny.CommanderOption(
				`-nn --${CliOptionNames.NoteNames}`,
				'Show note names vs. MIDI values.'
			)
		)
		.addOption(
			new tiny.CommanderOption(
				`-of --${CliOptionNames.OutputChannel} <channel>`,
				'Output channel number. All dumped if not specified.'
			).choices(_.range(1, 16).map(_.toString))
		)
		.addOption(
			new tiny.CommanderOption(
				`-of --${CliOptionNames.OutputFormat} <format>`,
				'Output Format.'
			)
				.choices(Object.values(CliFormatTypes))
				.default(CliFormatTypes.Simple)
		);
}

async function callback(options: Readonly<CliOptions>): Promise<void> {
	const input = await readInput(options);
	const parsed = midiFileIo.parseMidiBuffer(input);
	writeOutput(parsed, options);
}
