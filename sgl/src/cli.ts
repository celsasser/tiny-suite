/**
 * @license MIT (see project's LICENSE file)
 */

import * as tinyCoreModule from 'tiny-core-module';
import { description, version } from '../package.json';

import { readInput } from './input';
import { generateTinySequence } from './language';
import { writeOutput } from './output';
import { parseInput } from './parse';
import { CliOptionNames, CliOptions } from './types';

/**
 * The orchestrator. He works with our support cast to fully process this request.
 * And he manages the exit code and reporting if any is required
 */
export async function run({
	argv = process.argv,
}: {
	argv?: string[];
} = {}): Promise<void> {
	const program = createSpecification();
	await tinyCoreModule.run({
		argv,
		callback,
		name: 'tiny-sgl',
		program,
	});
}

/***********************
 * Private Interface
 **********************/
/**
 * Builds a command description
 */
function createSpecification(): tinyCoreModule.Command {
	return new tinyCoreModule.Command()
		.version(version)
		.description(description)
		.option(`-if --${CliOptionNames.InputFile} <path>`, 'Input file')
		.option(`-of --${CliOptionNames.OutputFile} <path>`, 'Output file')
		.argument('[specification]');
}

async function callback(options: CliOptions, args: ReadonlyArray<string>): Promise<void> {
	const input = await readInput(options, args);
	const parsed = parseInput(input);
	const evaluated = generateTinySequence(parsed.sequences[0], parsed.symbols);
	await writeOutput(evaluated, options);
}
