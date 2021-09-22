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
	/**
	 * The flow
	 */
	Flow = 'flow',
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
	Shape = 'shape',
}

export enum ProjectPropertyName {
	Name = '*name',
	PPQ = '*ppq',
	Steps = 'length',
	TimeSignature = '*timesignature',
}
