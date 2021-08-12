/**
 * Date: 12/8/19
 * Time: 2:03 AM
 * @license MIT (see project's LICENSE file)
 */

import {
	getNoteIntervalSymbols,
	getNoteNameSymbols,
	StringKeyedObject,
} from '@tiny/core';
import {
	cycleValueServer,
	invertValueServer,
	notValueServer,
	randomGroupingServer,
	randomSelectionServer,
} from '../servers';
import { FunctionName, ICoordinate, IMatrix, IState } from '../types';

const coreApiMap: Readonly<StringKeyedObject> = _createCoreApi();

/**
 * Creates a general state that will be valid as long as nothing
 * within the matrix is changed
 * @param matrix
 * @param coordinate
 * @param iteration
 * @throws {Error}
 */
export function createState(
	matrix: Readonly<IMatrix>,
	coordinate: Readonly<ICoordinate>,
	iteration: number
): IState {
	const state: IState = {
		column: coordinate.x,
		iteration,
		row: coordinate.y,
		...coreApiMap,
	};
	_addMatrixState(state, matrix);
	_addNumberServers(state);
	return state;
}

/**
 * Updates the state in which nothing in the matrix has changed.
 * @param state
 * @param coordinate
 * @throws {Error}
 */
export function modifyState(
	state: Readonly<IState>,
	coordinate: Readonly<ICoordinate>
): IState {
	return {
		...state,
		column: coordinate.x,
		row: coordinate.y,
	};
}

/***********************
 * Private Interface
 **********************/
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

function _addNumberServers(state: IState): void {
	state[FunctionName.Cycle] = cycleValueServer.bind(null, state);
	state[FunctionName.Invert] = invertValueServer.bind(null, state);
	state[FunctionName.Not] = notValueServer.bind(null, state);
	state[FunctionName.RandomGrouping] = randomGroupingServer.bind(null, state);
	state[FunctionName.RandomSelection] = state[FunctionName.Random] =
		randomSelectionServer.bind(null, state);
}

/**
 * Just the core objects We build it separately so that we
 * may perform the operation once (these guys are all immutable).
 */
function _createCoreApi(): StringKeyedObject {
	const map = {
		...getNoteIntervalSymbols().values,
		...getNoteNameSymbols().values,
	};
	Object.getOwnPropertyNames(Math).reduce<StringKeyedObject>(
		(accumulator, key): StringKeyedObject => {
			accumulator[key] = (Math as StringKeyedObject)[key];
			return accumulator;
		},
		map
	);
	return map;
}
