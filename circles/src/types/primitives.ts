/**
 * @license MIT (see project's LICENSE file)
 */

export enum CircleFlow {
	/**
	 * From high to low, on to off
	 */
	HighToLow = 'high-to-low',
	/**
	 * From high to low, on to off
	 */
	HighToLowOnToOff = 'high-to-low-on-to-off',
	/**
	 * From high to low, off to On
	 */
	HighToLowOffToOn = 'high-to-low-off-to-on',
	/**
	 * From low to high, on to off
	 */
	LowToHigh = 'low-to-high',
	/**
	 * From low to high, on to off
	 */
	LowToHighOnToOff = 'low-to-high-on-to-off',
	/**
	 * From low to high, off to on
	 */
	LowToHighOffToOn = 'low-to-high-off-to-on',
}

export enum CircleShape {
	Sawtooth = 'sawtooth',
	Sine = 'sine',
	Square = 'square',
	Triangle = 'triangle',
}

export function isFlowHighToLow(flow: CircleFlow): boolean {
	switch (flow) {
		case CircleFlow.HighToLow:
		case CircleFlow.HighToLowOffToOn:
		case CircleFlow.HighToLowOnToOff: {
			return true;
		}
	}
	return false;
}

export function isFlowLowToHigh(flow: CircleFlow): boolean {
	return !isFlowHighToLow(flow);
}

export function isFlowOnToOff(flow: CircleFlow): boolean {
	return !isFlowOffToOn(flow);
}

export function isFlowOffToOn(flow: CircleFlow): boolean {
	switch (flow) {
		case CircleFlow.HighToLowOffToOn:
		case CircleFlow.LowToHighOffToOn: {
			return true;
		}
	}
	return false;
}
