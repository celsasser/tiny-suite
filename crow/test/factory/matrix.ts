/**
 * @license MIT (see project's LICENSE file)
 */

import { Matrix } from '../../src/model';
import { IMatrix, ISize, MatrixGrid } from '../../src/types';
import { createTestCell } from './cell';

export function createTestMatrix(size: Readonly<ISize>): IMatrix {
	const grid: MatrixGrid = new Array(size.width);
	for (let y = 0; y < size.height; y++) {
		grid[y] = new Array(size.height);
		for (let x = 0; x < size.width; x++) {
			grid[x][y] = createTestCell({ x, y });
		}
	}
	return new Matrix(grid);
}
