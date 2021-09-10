/**
 * @license MIT (see project's LICENSE file)
 *
 * Our language's vocabulary
 */

/***********************
 * We don't declare any vocabulary enums here but we support this convention
 * throughout our suite. Here we include API to support our vocabularies.
 * - to support dynamically discovered optional properties we preface
 *   enum values with '*'.
 **********************/

/**
 * Gets all works in T's vocabulary. '*' prefixes are stripped.
 * @param t
 * @returns sorted array of all conditioned properties
 */
export function getAllVocabularyProperties<T extends { [property: string]: string }>(
	t: T
): string[] {
	return Object.values(t)
		.map((v) => (v.startsWith('*') ? v.substr(1) : v))
		.sort();
}

/**
 * Gets all required properties (those without '*' prefix).
 * @param t
 * @returns sorted array of all required properties
 */
export function getRequiredVocabularyProperties<T extends { [property: string]: string }>(
	t: T
): string[] {
	return Object.values(t)
		.filter((v) => !v.startsWith('*'))
		.sort();
}

/**
 * Gets optional properties with '*' prefix stripped off
 * @param t
 * @returns sorted array of all conditioned optional properties
 */
export function getOptionalVocabularyProperties<T extends { [property: string]: string }>(
	t: T
): string[] {
	return Object.values(t)
		.filter((v) => v.startsWith('*'))
		.map((v) => v.substr(1))
		.sort();
}
