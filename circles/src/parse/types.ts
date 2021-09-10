/**
 * @license MIT (see project's LICENSE file)
 */

import { RecastRecord } from '@tiny/core';
import { ICircleProperties, IProjectProperties } from '../types';

export type InterimCircleProperties = RecastRecord<ICircleProperties, string>;
export type InterimProjectProperties = RecastRecord<IProjectProperties, string>;

export interface IInterimParsedInput {
	circles: InterimCircleProperties[];
	project: InterimProjectProperties;
}
