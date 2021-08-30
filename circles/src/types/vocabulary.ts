/**
 * @license MIT (see project's LICENSE file)
 *
 * Our language's vocabulary
 */

export enum ReservedIdentifier {
	Project = 'project',
}

export enum CirclePropertyName {
	Description = '*description',
	/**
	 * Overall width
	 */
	Diameter = 'diameter',
	Divisions = 'divisions',
	Min = 'min',
	Max = 'max',
	Name = '*name',
	/**
	 * Phase of shape
	 */
	Phase = 'phase',
	/**
	 * The flow
	 */
	Shape = 'shape',
}

export enum ProjectPropertyName {
	Name = 'name',
	Steps = 'steps',
}

export function getAllVocabularyProperties<T extends { [property: string]: string }>(
	t: T
): ReadonlyArray<string> {
	return Object.values(t);
}

export function getRequiredVocabularyProperties<T extends { [property: string]: string }>(
	t: T
): ReadonlyArray<string> {
	return Object.values(t).filter((v) => !v.startsWith('*'));
}

export function getOptionalVocabularyProperties<T extends { [property: string]: string }>(
	t: T
): ReadonlyArray<string> {
	return Object.values(t)
		.filter((v) => v.startsWith('*'))
		.map((v) => v.substr(1));
}
