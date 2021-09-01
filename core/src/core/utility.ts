/**
 * @license MIT (see project's LICENSE file)
 *
 * A collection of utility types that extend Typescript's
 */

/**
 * Recast all properties with `Record` to be of type `Cast`
 */
export type RecastRecord<Record, Cast> = { [Property in keyof Record]: Cast };
