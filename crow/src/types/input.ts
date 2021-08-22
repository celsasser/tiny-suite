/**
 * @license MIT (see project's LICENSE file)
 */

import { ISong } from './model';

/**
 * For our static/CLI interface
 */
export interface IStaticInput {
	song: ISong;
	/**
	 * Section id for which to generate the matrix
	 */
	readonly sectionId: string;
	/**
	 * Heading id for which we should generate the section
	 */
	readonly headingId: string;
}
