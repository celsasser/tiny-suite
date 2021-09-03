/**
 * @license MIT (see project's LICENSE file)
 */

import * as io from '../../src/io';
import * as fs from 'fs-extra';
import * as getStdin from 'get-stdin';
import { directoryToDescribeTitle } from '../utils';

jest.mock('get-stdin');
jest.mock('fs-extra');
const mockedGetStdin = getStdin as jest.MockedFunction<typeof getStdin>;
const mockedFs = fs as jest.Mocked<typeof fs>;

describe(directoryToDescribeTitle(__dirname, 'io'), function () {
	describe('readFile', function () {
		it('should properly retrieve and return', async function () {
			// @ts-expect-error: "Argument of type 'string'...", but it is one of described return
			// types
			mockedFs.readFile.mockResolvedValue('morning');
			await expect(io.readFile('path')).resolves.toEqual('morning');
			expect(mockedFs.readFile).toBeCalledWith('path', { encoding: 'utf-8' });
		});
	});

	describe('readStdin', function () {
		it('should properly return getStdin retrieval', async function () {
			mockedGetStdin.mockResolvedValue('afternoon');
			return expect(io.readStdin()).resolves.toEqual('afternoon');
		});
	});

	describe('writeJsonToPath', function () {
		it('should properly write', async function () {
			await expect(io.writeJsonToPath('path', 'data')).resolves.toEqual(undefined);
			expect(mockedFs.writeJSON).toBeCalledWith('path', 'data', undefined);
		});
	});

	describe('writeToPath', function () {
		it('should properly write', async function () {
			await expect(io.writeToPath('path', 'data')).resolves.toEqual(undefined);
			expect(mockedFs.writeFile).toBeCalledWith('path', 'data', undefined);
		});
	});

	describe('writeStdout', function () {
		it('should properly write', async function () {
			await expect(io.writeStdout('data')).resolves.toEqual(undefined);
			expect(mockedFs.write).toBeCalledWith(process.stdout.fd, 'data');
		});
	});
});
