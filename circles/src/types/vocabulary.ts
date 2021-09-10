/**
 * @license MIT (see project's LICENSE file)
 *
 * Our language's vocabulary
 */

export enum ReservedIdentifier {
	Project = 'project',
}

export enum CirclePropertyName {
	Channel = '*channel',
	Description = '*description',
	/**
	 * Overall width
	 */
	Diameter = 'diameter',
	Divisions = 'divisions',
	Min = 'min',
	Max = 'max',
	Name = '*name',
	Notes = 'notes',
	/**
	 * Optional `off` length of each note. Defaults to 0.
	 * Note: should use `on` and `off` mutually exclusively
	 */
	Off = '*off',
	/**
	 * Optional `on` length of each note. Defaults to `diameter/divisions`
	 * Note: should use `on` and `off` mutually exclusively
	 */
	On = '*on',
	/**
	 * Phase of shape
	 */
	Phase = '*phase',
	/**
	 * The flow
	 */
	Shape = 'shape',
}

export enum ProjectPropertyName {
	Name = '*name',
	PPQ = '*ppq',
	Steps = 'length',
	TimeSignature = '*timesignature',
}

export function getAllVocabularyProperties<T extends { [property: string]: string }>(
	t: T
): ReadonlyArray<string> {
	return Object.values(t).map((v) => (v.startsWith('*') ? v.substr(1) : v));
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
