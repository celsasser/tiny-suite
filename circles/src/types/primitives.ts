/**
 * @license MIT (see project's LICENSE file)
 */

export enum CircleShape {
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

export function isShapeHighToLow(shape: CircleShape): boolean {
	switch (shape) {
		case CircleShape.HighToLow:
		case CircleShape.HighToLowOffToOn:
		case CircleShape.HighToLowOnToOff: {
			return true;
		}
	}
	return false;
}

export function isShapeLowToHigh(shape: CircleShape): boolean {
	return !isShapeHighToLow(shape);
}

export function isShapeOnToOff(shape: CircleShape): boolean {
	return !isShapeOffToOn(shape);
}

export function isShapeOffToOn(shape: CircleShape): boolean {
	switch (shape) {
		case CircleShape.HighToLowOffToOn:
		case CircleShape.LowToHighOffToOn: {
			return true;
		}
	}
	return false;
}
