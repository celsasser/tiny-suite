/**
 * @license MIT (see project's LICENSE file)
 */

export enum CliOptionNames {
	Channel = 'channel',
	InputFile = 'inputFile',
	NoteNames = 'noteNames',
	OutputFormat = 'outputFormat',
}

export enum CliFormatTypes {
	Simple = 'simple',
	Detailed = 'detailed',
}

export type CliOptions = { [key in CliOptionNames]: string };
