/**
 * @license MIT (see project's LICENSE file)
 */

import { IMatrix, ISize, MatrixGrid } from '../../src/types';
import { createTestCell } from './cell';

export function createTestMatrix(size: Readonly<ISize>): IMatrix {
	const matrix: MatrixGrid = new Array(size.width);
	for (let y = 0; y < size.height; y++) {
		matrix[y] = new Array(size.height);
		for (let x = 0; x < size.width; x++) {
			matrix[x][y] = createTestCell({ x, y });
		}
	}
	return matrix;
}
