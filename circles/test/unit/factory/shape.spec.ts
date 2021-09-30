/**
 * @license MIT (see project's LICENSE file)
 */

import * as _ from 'lodash';
import { directoryToDescribeTitle } from '@tiny/core';
import { createShapeFunction } from '../../../src/factory/shape';
import { ICircleProperties } from '../../../src/types';
import * as createTriangleFunctionTests from './expect/createTriangleFunction.json';

describe(directoryToDescribeTitle(__dirname, 'shape'), function () {
	describe('createSawtoothFunction', function () {});

	describe('createSineFunction', function () {});

	describe('createSquareFunction', function () {});

	describe('createTriangleFunction', function () {
		createTriangleFunctionTests.forEach((test) => {
			it(test.text, function () {
				const shapeFunction = createShapeFunction(test.input.circle as ICircleProperties);
				const result = _.range(test.input.ppqs).map(shapeFunction);
				expect(result).toEqual(test.expect);
			});
		});
	});
});
