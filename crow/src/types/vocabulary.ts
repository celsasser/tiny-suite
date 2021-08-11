/**
 * @license MIT (see project's LICENSE file)
 *
 * Our language's vocabulary
 */

/**
 * We add all functions and special constants to our state but we are
 * not going to include them here. In fact, I'm not sure there is value
 * in this guy since we are not going to be parsing like we do in 'tiny.graph'
 */
export enum FunctionName {
	/**
	 * Our homegrown functions
	 */
	Cycle = 'cycle',
	Random = 'random',
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

export enum MatrixColumnPropertyName {
	NoteOffset = 'noteOffset',
	PanOffset = 'panOffset',
	VelocityOffset = 'velocityOffset',
}

export enum MatrixRowPropertyName {
	NoteOffset = MatrixColumnPropertyName.NoteOffset,
	PanOffset = MatrixColumnPropertyName.PanOffset,
	VelocityOffset = MatrixColumnPropertyName.VelocityOffset,
}
