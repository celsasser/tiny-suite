/**
 * @license MIT (see project's LICENSE file)
 */

export enum ITestOption {
	Only = 'only',
	Skip = 'skip',
}

export interface ITest {
	options?: (string | ITestOption)[];
}

export function filterTests<T extends ITest>(tests: ReadonlyArray<T>): T[] {
	const filtered: {
		only: T[];
		include: T[];
	} = {
		only: [],
		include: [],
	};
	tests.reduce((result, test) => {
		if (test.options && test.options.includes(ITestOption.Only)) {
			result.only.push(test);
		}
		if (!test.options || !test.options.includes(ITestOption.Skip)) {
			result.include.push(test);
		}
		return result;
	}, filtered);
	return filtered.only.length > 0 ? filtered.only : filtered.include;
}
