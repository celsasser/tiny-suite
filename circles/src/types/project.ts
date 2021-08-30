/**
 * @license MIT (see project's LICENSE file)
 */

export interface IParsedInput {
	circles: ICircleProperties[];
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

export interface ICircleProperties {
	name: string;
}
