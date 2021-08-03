/**
 * @license MIT (see project's LICENSE file)
 */

export type CliCallback<TOptions> = (
	options: Readonly<TOptions>,
	args: ReadonlyArray<string>
) => Promise<void>;
