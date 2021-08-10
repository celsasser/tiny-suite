/**
 * @license MIT (see project's LICENSE file)
 */

import * as assert from 'assert';
import { ICoordinate, IMatrix, IState } from './types';

export function createState(
	matrix: Readonly<IMatrix>,
	coordinate: Readonly<ICoordinate>,
	iteration: number
): IState {
	const state: IState = {
		column: coordinate.x,
		iteration,
		row: coordinate.y,
	};
	_addMatrixState(state, matrix);
	return state;
}

/**
 * Updates the state for an iteration. Meaning `iteration` must be the same
 * as `state.iteration`. The state will mostly be the same.
 * @param state
 * @param coordinate
 * @param iteration
 */
export function modifyState(
	state: Readonly<IState>,
	coordinate: Readonly<ICoordinate>,
	iteration: number
): IState {
	assert.strictEqual(iteration, state.iteration);
	return {
		...state,
		column: coordinate.x,
		row: coordinate.y,
	};
}

function _addMatrixState(state: IState, matrix: Readonly<IMatrix>): void {
	const size = matrix.size;
	for (let x = 0; x < size.width; x++) {
		for (let y = 0; y < size.width; y++) {
			const cell = matrix.getCell({ x, y });
			if (cell.noteFormula !== undefined) {
				// we will allow a shorthand version of note being that
				// he will probably be popular with the ladies...
				state[cell.id] = state[`${cell.id}.note`] = cell.noteFormula;
			}
			if (cell.panFormula !== undefined) {
				state[`${cell.id}.pan`] = cell.panFormula;
			}
			if (cell.velocityFormula !== undefined) {
				state[`${cell.id}.velocity`] = cell.velocityFormula;
			}
		}
	}
}
