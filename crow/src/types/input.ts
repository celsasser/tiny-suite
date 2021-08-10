/**
 * @license MIT (see project's LICENSE file)
 */

import { ISong, IState } from './model';

/**
 * For our static/CLI interface
 */
export interface IStaticInput {
	song: ISong;
	state: IState;
}
