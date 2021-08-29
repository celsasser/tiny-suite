/**
 * @license MIT (see project's LICENSE file)
 */

import { Database } from '../database';

export interface IParsedInput {
	database: Database;
	project: IProjectProperties;
}

export interface IProjectProperties {
	/**
	 * Name of starting vertex
	 */
	start: string;
	/**
	 * The maximum number of steps to be taken before forcibly ending
	 * graph traversal
	 */
	steps?: number;
}
