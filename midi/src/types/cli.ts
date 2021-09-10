/**
 * @license MIT (see project's LICENSE file)
 */

export enum CliOptionNames {
	PulsePerNote = 'pulsePerNote',
	PulsePerQuarter = 'pulsePerQuarter',
	Tempo = 'tempo',
	Velocity = 'velocity',
	InputFile = 'inputFile',
	OutputFile = 'outputFile',
}

export type CliOptions = { [key in CliOptionNames]: string };
