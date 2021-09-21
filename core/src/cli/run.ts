/**
 * @license MIT (see project's LICENSE file)
 */

import { Command } from 'commander';
import { CliCallback } from '../types';

/**
 * He's nothing to write home to mome to, but he establishes standardization with how
 * our applications are execute and how errors are reports along with some nice typing so
 * that we can be dumb like we like to be and pomade our hair and get ready for the friday
 * sock hop
 * @param argv
 * @param callback - this is your place to do the business that needs to get done
 * @param name - name by which your executable goes by. For error reporting
 * @param program - Only you know what you program should do. We'll export them for you.
 * 	you need to define it.
 */
export async function run<TOptions = { [property: string]: string }>({
	argv = process.argv,
	callback,
	name,
	program,
}: {
	argv?: string[];
	callback: CliCallback<TOptions>;
	name: string;
	program: Command;
}): Promise<void> {
	try {
		// parse the lad
		program = program.parse(argv);
		// now we let our button pushers do what needs to be done
		await callback(program.opts<TOptions>(), program.args);
		process.exit(0);
	} catch (error) {
		console.error(`${name} error: ${error.message}`);
		// todo: get rid of once the dust settles
		console.debug(error.stack.split(/\n/).slice(1));
		process.exit(1);
	}
}
