/**
 * @license MIT (see project's LICENSE file)
 *
 * We are going to be a big dummy about these guys and rely on:
 * 1. parsing to get string values
 * 2. our machine to re-cast values as necessary
 */

import { CircleShape } from './primitives';

export interface ICircleProperties {
	description?: string;
	diameter: string | number;
	divisions: string | number;
	min: string | number;
	max: string | number;
	/**
	 * Defaulted from the ini declaration
	 */
	name: string;
	phase: string | number;
	shape: CircleShape;
}

export interface IProjectProperties {
	name: string;
	/**
	 * The maximum number of steps to be taken before forcibly ending
	 * graph traversal
	 */
	steps: string | number;
}

export interface IParsedInput {
	circles: ICircleProperties[];
	project: IProjectProperties;
}
