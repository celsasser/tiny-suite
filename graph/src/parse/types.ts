/**
 * @license MIT (see project's LICENSE file)
 */

import { Edge, Vertex } from '../graph';

export type EdgeConstructorParams = ConstructorParameters<typeof Edge>[0];
export type VertexConstructorParams = ConstructorParameters<typeof Vertex>[0];

type RecastEdgePropertiesToString =
	| 'panOffset'
	| 'velocityOffset'
	| 'vertexFrom'
	| 'vertexTo'
	| 'weight';
export type InterimEdgeConstructorParams = Omit<
	EdgeConstructorParams,
	RecastEdgePropertiesToString
> &
	Record<RecastEdgePropertiesToString, string>;

type RecastVertexPropertiesToString =
	| 'channel'
	| 'notes'
	| 'pan'
	| 'velocity'
	| 'weights';
export type InterimVertexConstructorParams = Omit<
	VertexConstructorParams,
	RecastVertexPropertiesToString
> &
	Record<RecastVertexPropertiesToString, string>;

export type InterimEdgeConstructorParamsArray = InterimEdgeConstructorParams[];
export type InterimVertexConstructorParamsMap = {
	[name: string]: InterimVertexConstructorParams;
};

/**
 * With lexical parsing we are not being very aggressive and are going to move the phase
 * of parsing the function name and parameters into the compile phase. Why? because we
 * ultimately want to treat an argument as anything that serves content which includes
 * references to other object properties as sources of data. And the results of other
 * functions. AND, assuming the ambitions above, I am leaving the parsing layer drop dead
 * simple for now. We may divide responsibilities but not today. And we may never get
 * that far.
 */
export interface IPropertyAssignment {
	name: string;
	rvalue: string;
}
