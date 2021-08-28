/**
 * @license MIT (see project's LICENSE file)
 */

import * as tinyCoreModule from '@tiny/core';
import { description, version } from '../package.json';

import { readInputData } from './input';
import { StaticMachine } from './machine';
import { writeStaticOutput } from './output';
import { parseInputData, validateInputSpecification } from './parse';
import { CliOptionNames, CliOptions } from './types';

/**
 * The orchestrator. He works with our support cast to fully process this request.
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
		.option(`-it --${CliOptionNames.Iterations} [value]`, 'Input file', '16')
		.option(`-of --${CliOptionNames.OutputFile} <path>`, 'Output file')
		.option(`-sv --${CliOptionNames.Server}`, 'Run as a server')
		.option(`-sv --${CliOptionNames.Port} <port>`, 'Run as a server', '3200')
		.option(`-vr --${CliOptionNames.Rectangular}`, 'Verifies matrix column counts match');
}

async function callback(
	options: Readonly<CliOptions>,
	args: ReadonlyArray<string>
): Promise<void> {
	if (options.server) {
		await processServerRequest(options);
	} else {
		await processStaticRequest(options, args);
	}
}

async function processServerRequest(options: Readonly<CliOptions>): Promise<void> {
	throw new tinyCoreModule.NotImplemented();
}

async function processStaticRequest(
	options: Readonly<CliOptions>,
	args: ReadonlyArray<string>
): Promise<void> {
	const input = parseInputData(await readInputData(options));
	const { validInput, validOptions } = validateInputSpecification(input, options);
	const machine = new StaticMachine(validInput, validOptions);
	const output = machine.run();
	await writeStaticOutput(output, options);
}
