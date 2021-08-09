/**
 * @license MIT (see project's LICENSE file)
 */

export enum CliOptionNames {
	InputFile = 'inputFile',
	OutputFile = 'outputFile',
	Server = 'server',
}

export type CliOptions = { [key in CliOptionNames]: string };
