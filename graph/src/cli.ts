/**
 * @license MIT (see project's LICENSE file)
 */

import * as tinyCoreModule from '@tiny/core';
import { description, version } from '../package.json';

import { readInput } from './input';
import { Machine } from './machine';
import { writeOutput } from './output';
import { parseInput } from './parse';
import { CliOptionNames, CliOptions } from './types';

/**
 * The orchestrator. He works with our support cast to fully process this request.
 * And he manages the exit code and reporting if any is required
 */
export async function run(argv: string[] = process.argv): Promise<void> {
	const program = createSpecification();
	await tinyCoreModule.run({
		argv,
		callback,
		name: 'tiny-gts',
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
		.option(`-of --${CliOptionNames.OutputFile} <path>`, 'Output file');
}

async function callback(options: CliOptions): Promise<void> {
	const input = await readInput(options);
	const parsed = parseInput(input);
	const machine = new Machine(parsed);
	const output = machine.run();
	await writeOutput(output, options);
}
