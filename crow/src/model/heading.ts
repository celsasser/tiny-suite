/**
 * @license MIT (see project's LICENSE file)
 */

import { trimString } from '@tiny/core';
import { createColumnHeadingCell, createRowHeadingCell } from '../factory';
import {
	IColumnHeadingCell,
	IMatrixHeading,
	IRowHeadingCell,
	ISize,
	KeyboardShortcutType,
} from '../types';

export class MatrixHeading implements IMatrixHeading {
	public shortcut?: KeyboardShortcutType;
	private _columns: IColumnHeadingCell[];
	private _name?: string;
	private _rows: IRowHeadingCell[];

	constructor(columns: IColumnHeadingCell[], rows: IRowHeadingCell[]) {
		this._columns = columns;
		this._rows = rows;
	}

	/***********************
	 * Public Accessors
	 **********************/
	public get columns(): ReadonlyArray<IColumnHeadingCell> {
		return this._columns;
	}

	public get name(): string | undefined {
		return this._name;
	}

	public set name(value: string | undefined) {
		this._name = trimString(value);
	}
	public get rows(): ReadonlyArray<IRowHeadingCell> {
		return this._rows;
	}

	public get size(): ISize {
		return {
			height: this._rows.length,
			width: this._columns.length,
		};
	}

	public set size(value: ISize) {
		// columns
		if (value.width < this._columns.length) {
			this._columns.splice(value.width);
		} else {
			for (let x = this._columns.length; x < value.height; x++) {
				this._columns.push(createColumnHeadingCell(x));
			}
		}
		// rows
		if (value.height < this._rows.length) {
			this._rows.splice(value.height);
		} else {
			for (let x = this._rows.length; x < value.height; x++) {
				this._rows.push(createRowHeadingCell(x));
			}
		}
	}
}
