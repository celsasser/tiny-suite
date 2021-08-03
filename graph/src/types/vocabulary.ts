/**
 * @license MIT (see project's LICENSE file)
 *
 * Our language's vocabulary
 */

export enum Cardinality {
	/**
	 * One whatever it is at a time
	 */
	Mono = 'mono',
	/**
	 * Multiple (or all) of whatever it is at a time.
	 */
	Poly = 'poly',
}

export enum ReservedIdentifier {
	Project = 'project',
}

export enum ProjectPropertyName {
	Name = 'name',
	Start = 'start',
	Steps = 'steps',
}

export enum EdgePropertyName {
	Name = 'name',
	PanOffset = 'panOffset',
	VelocityOffset = 'velocityOffset',
	Weight = 'weight',
}

export enum VertexPropertyName {
	Channel = 'channel',
	Name = 'name',
	Notes = 'notes',
	Transition = 'transition',
	Velocity = 'velocity',
	Weights = 'weights',
}

export enum FunctionName {
	Cycle = 'cycle',
	Not = 'not',
	/**
	 * Randomly builds groups of values from a selection or range of values
	 */
	RandomGrouping = 'randomGrouping',
	/**
	 * Random either works with values of his creation or values with
	 * which he is given. And within those states makes random chords
	 * guided by the arguments of the method.
	 */
	RandomSelection = 'randomSelection',
}

export enum FunctionOption {
	/**
	 * Repeat the same sequence once generated
	 */
	Cycle = 'cycle',
	/**
	 * Re-use values before all or exhausted
	 */
	Reuse = 'reuse',
}
