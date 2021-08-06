import { IChannel, MonophonicArray, PolyphonicArray } from '@tiny/core';

export function createTestMonophonicArray(
	array = require('../res/monophonicArray.json')
): MonophonicArray {
	return array;
}

export function createTestPolyphonicArray(
	array = require('../res/polyphonicArray.json')
): PolyphonicArray {
	return array;
}

export function createChannelArray(array = require('../res/channelArray')): IChannel[] {
	return array;
}
