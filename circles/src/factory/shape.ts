/**
 * @license MIT (see project's LICENSE file)
 */

import { CircleShape, ICircleProperties, isFlowHighToLow, ShapeFunction } from '../types';

export function createShapeFunction(circle: Readonly<ICircleProperties>): ShapeFunction {
	switch (circle.shape) {
		case CircleShape.Sawtooth:
			return createSawtoothFunction(circle);
		case CircleShape.Sine:
			return createSineFunction(circle);
		case CircleShape.Square:
			return createSquareFunction(circle);
		case CircleShape.Triangle:
			return createTriangleFunction(circle);
		default: {
			throw Error(`unknown circle shape "${circle.shape}"`);
		}
	}
}

function createSawtoothFunction(circle: Readonly<ICircleProperties>): ShapeFunction {
	const shapeIsHighToLow = isFlowHighToLow(circle.flow);
	const phaseOffset = circle.diameter * circle.phase;
	return (ppq: number): number => {
		const ppqOffset = (ppq + phaseOffset) % circle.diameter;
		return shapeIsHighToLow
			? circle.max - (circle.max - circle.min) * (ppqOffset / circle.diameter)
			: circle.min + (circle.max - circle.min) * (ppqOffset / circle.diameter);
	};
}

function createSineFunction(circle: Readonly<ICircleProperties>): ShapeFunction {
	const shapeIsHighToLow = isFlowHighToLow(circle.flow);
	const startingPhase = Math.PI * 2 * circle.phase + (shapeIsHighToLow ? Math.PI : 0);
	return (ppq: number): number => {
		// convert ppq to the position in a cycle (in radians)
		const radianOffset = (Math.PI * 2 * ppq) / circle.diameter;
		const cosineNormalized = (Math.cos(startingPhase + radianOffset) + 1) / 2;
		return circle.min + (circle.max - circle.min) * cosineNormalized;
	};
}

function createSquareFunction(circle: Readonly<ICircleProperties>): ShapeFunction {
	const shapeIsHighToLow = isFlowHighToLow(circle.flow);
	const phaseOffset = circle.diameter * circle.phase;
	return (ppq: number): number => {
		const ppqOffset = (ppq + phaseOffset) % circle.diameter;
		if (shapeIsHighToLow) {
			return ppqOffset < circle.diameter / 2 ? circle.max : circle.min;
		} else {
			return ppqOffset < circle.diameter / 2 ? circle.min : circle.max;
		}
	};
}

function createTriangleFunction(circle: Readonly<ICircleProperties>): ShapeFunction {
	const shapeIsHighToLow = isFlowHighToLow(circle.flow);
	const phaseOffset = circle.diameter * (circle.phase + (shapeIsHighToLow ? 0.5 : 0));
	const halfDiameter = circle.diameter / 2;
	return (ppq: number): number => {
		const ppqOffset = (ppq + phaseOffset) % circle.diameter;
		return ppqOffset < halfDiameter
			? circle.min + (circle.max - circle.min) * (ppqOffset / halfDiameter)
			: circle.max -
					(circle.max - circle.min) * ((ppqOffset - halfDiameter) / halfDiameter);
	};
}
