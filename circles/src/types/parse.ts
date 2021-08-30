/**
 * @license MIT (see project's LICENSE file)
 */

/**
 * With lexical parsing we are not being very aggressive and are going to move the phase
 * of parsing the function name and parameters into the compile phase. Why? because we
 * ultimately want to treat an argument as anything that serves content which includes
 * references to other object properties as sources of data. And the results of other
 * functions. AND, assuming the ambitions above, I am leaving the parsing layer drop dead
 * simple for now. We may divide responsibilities but not today. And we may never get
 * that far.
 */
export interface IPropertyAssignment {
	name: string;
	rvalue: string;
}
