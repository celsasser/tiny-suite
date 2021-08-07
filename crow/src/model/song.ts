/**
 * @license MIT (see project's LICENSE file)
 */

import { trimString } from '@tiny/core';
import {
	IMatrix,
	IMatrixHeading,
	ISection,
	ISize,
	ISong,
	KeyboardShortcutType,
} from '../types';

export class Section implements ISection {
	public readonly headings: IMatrixHeading[];
	public readonly matrix: IMatrix;
	/**
	 * Optional key-chord that will activate the same section and make him crack rocks
	 */
	public shortcut?: KeyboardShortcutType;
	public name?: string;
	private _description?: string;
	private _size: ISize;

	constructor({
		headings,
		matrix,
		size,
	}: {
		headings: IMatrixHeading[];
		matrix: IMatrix;
		size: ISize;
	}) {
		this.headings = headings;
		this.matrix = matrix;
		this._size = size;
	}

	public get description(): string | undefined {
		return this._description;
	}

	public set description(value: string | undefined) {
		this._description = trimString(value);
	}

	public get size(): Readonly<ISize> {
		return this._size;
	}
	public set size(value: Readonly<ISize>) {
		this._size = value;
		this.matrix.size = value;
		this.headings.forEach((heading) => (heading.size = value));
	}
}

export class Song implements ISong {
	// @ts-expect-error: not implemented yet
	private _description?: string;
	public sections: ISection[];
	private _name?: string;

	constructor(sections: ISection[]) {
		this.sections = sections;
	}

	/***********************
	 * Public Accessors
	 **********************/
	public get name(): string | undefined {
		return this._name;
	}

	public set name(value: string | undefined) {
		this._name = trimString(value);
	}
}
