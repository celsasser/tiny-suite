/**
 * @license MIT (see project's LICENSE file)
 */

import * as assert from 'assert';
import * as _ from 'lodash';
import { createCell } from '../factory';
import { Bearing, ICell, ICoordinate, IMatrix, ISize, MatrixGrid } from '../types';
import { coordinateFromId, isCoordinateWithinSize } from './coordinate';

/**
 * Our matrix can only get bigger. We will not delete data should a size be reduced.
 * The reason is that we want to keep the data in the cells that were removed in the
 * event that the user wants to blow it back up.
 */
export class Matrix implements IMatrix {
	/**
	 * We are going to index like other graphs like to be indexed: array[col, row]
	 */
	private readonly _grid: Array<ICell[]>;

	constructor(grid: MatrixGrid) {
		this._grid = grid;
	}

	/**
	 * Does a deep clone on our libby buddy
	 */
	public clone(): Matrix {
		const size = this.size;
		const grid: MatrixGrid = new Array(size.width);
		for (let icolumn = 0; icolumn < grid.length; icolumn++) {
			grid[icolumn] = this._grid[icolumn].map((cell) => cell.clone());
		}
		return new Matrix(grid);
	}

	/***********************
	 * Accessors
	 **********************/
	public get size(): Readonly<ISize> {
		return {
			height: _.get(this._grid[0], 'length', 0),
			width: this._grid.length,
		};
	}

	public set size(size: Readonly<ISize>) {
		const currentSize = this.size;
		// columns
		if (size.width < currentSize.width) {
			this._grid.splice(size.width);
		} else {
			for (let x = currentSize.width; x < size.width; x++) {
				// we are intentionally matching the existing height. We will deal with row
				// changes next
				this._grid[x] = _.range(currentSize.height).map<ICell>((y) =>
					createCell({ x, y })
				);
			}
		}
		// rows
		if (size.height < currentSize.height) {
			this._grid.forEach((column) => {
				column.splice(size.height);
			});
		} else if (size.width > currentSize.width) {
			this._grid.forEach((column, x) => {
				for (let y = currentSize.height; y < size.height; y++) {
					column.push(createCell({ x, y }));
				}
			});
		}
	}

	/***********************
	 * Public API
	 **********************/
	public getCell(coordinate: Readonly<ICoordinate>): ICell {
		assert(isCoordinateWithinSize(coordinate, this.size));
		return this._grid[coordinate.x][coordinate.y];
	}

	getCellById(id: string): ICell {
		return this.getCell(coordinateFromId(id));
	}

	public getColumnCells(
		column: number,
		bearing: Bearing.South | Bearing.SouthEast | Bearing.SouthWest
	): ICell[] {
		const result: ICell[] = [];
		const size = this.size;
		const columnDrift =
			bearing === Bearing.South ? 0 : bearing === Bearing.SouthEast ? 1 : -1;
		for (let y = 0; y < size.height; y++) {
			const x = column + columnDrift * y;
			if (x <= 0 || x >= size.width) {
				break;
			}
			result.push(this.getCell({ x, y }));
		}
		return result;
	}

	public getRowCells(
		row: number,
		bearing: Bearing.East | Bearing.NorthEast | Bearing.SouthEast
	): ICell[] {
		const result: ICell[] = [];
		const size = this.size;
		const rowDrift =
			bearing === Bearing.East ? 0 : bearing === Bearing.SouthEast ? 1 : -1;
		for (let x = 0; x < size.height; x++) {
			const y = row + rowDrift * x;
			if (y <= 0 || y >= size.height) {
				break;
			}
			result.push(this.getCell({ x, y }));
		}
		return result;
	}
}
