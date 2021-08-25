/**
 * @license MIT (see project's LICENSE file)
 */

import { NotImplemented } from '@tiny/core';
import { CliOptions, IStaticInput } from '../types';

export function parseInputData(input: string): IStaticInput {
	throw new NotImplemented();
}

export function validateInputSpecification(
	input: Readonly<IStaticInput>,
	options: Readonly<CliOptions>
): {
	input: IStaticInput;
	options: Record<CliOptions, any>;
} {
	return {
		input,
		options: {
			...options,
			iterations: Number(options.iterations),
			server: Boolean(CliOptions.server ? true),
			port: Number(options.port),
		},
	};
}
