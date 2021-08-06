/**
 * @license MIT (see project's LICENSE file)
 */

import { SymbolTable } from '@tiny/core';
import { Edge, Vertex } from '../graph';

export type EdgeMap = { [name: string]: Edge };
export type VertexMap = { [name: string]: Vertex };

/**
 * I'm leaving room for symbols that point to symbols but not going as far
 * as supporting arrays. Our deep resolution functionality in `SymbolTable`
 * isn't that smart.
 */
export class TinySymbolTable extends SymbolTable<string | number> {}

export type NumbersServer = () => number[];
