/**
 * @license MIT (see project's LICENSE file)
 */

export enum CliOptionNames {
	InputFile = 'inputFile',
	OutputChannel = 'outputChannel',
	OutputFormat = 'outputFormat',
}

export enum CliFormatTypes {
	Simple = 'simple',
	Detailed = 'detailed',
}

export type CliOptions = { [key in CliOptionNames]: string };
