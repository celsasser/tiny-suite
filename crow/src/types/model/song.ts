/**
 * @license MIT (see project's LICENSE file)
 */

import { KeyboardShortcutType } from './primitives';
import { ISize } from './core';
import { IMatrix, IMatrixHeading } from './matrix';

export interface ISection {
	headings: IMatrixHeading[];
	description?: string;
	name?: string;
	matrix: IMatrix;
	shortcut?: KeyboardShortcutType;
	size: ISize;
}

export interface ISong {
	description?: string;
	name?: string;
	sections: ISection[];
}
