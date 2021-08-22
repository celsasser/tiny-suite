/**
 * @license MIT (see project's LICENSE file)
 */

import { ISize, KeyboardShortcutType } from './core';
import { IMatrix, IMatrixHeading } from './matrix';

export interface ISection {
	/**
	 * 0 or more headings for this section. For consistency I am going to encourage all
	 * sections to have column and row headings. Maybe that is just tough guy talk.
	 */
	readonly headings: IMatrixHeading[];
	description?: string;
	/**
	 * Unique id of this section
	 */
	readonly id: string;
	readonly matrix: IMatrix;
	shortcut?: KeyboardShortcutType;
	size: ISize;
}

export interface ISong {
	description?: string;
	name?: string;
	readonly sections: ISection[];
}
