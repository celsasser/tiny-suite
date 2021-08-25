/**
 * @license MIT (see project's LICENSE file)
 */

export enum CliOptionNames {
	InputFile = 'inputFile',
	Iterations = 'iterations',
	OutputFile = 'outputFile',
	Port = 'port',
	/**
	 * Whether the user wants the grid to be validated as being rectangular
	 * or not. We support non rectangular for poly-meter (time-signature)
	 */
	Rectangular = 'rectangular',
	/**
	 * Whether we are going to run in server mode or in a CLI way.
	 */
	Server = 'server',
}

export type CliOptions = { [key in CliOptionNames]: string };
