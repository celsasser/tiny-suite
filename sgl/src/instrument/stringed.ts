/**
 * @license MIT (see project's LICENSE file)
 */

import { SymbolMap } from '@tiny/core';
import * as _ from 'lodash';
import { TinyInstrument, TinyInstrumentString } from '../types';

/**
 * This is the stringed instrument of your dreams that does almost next to nothing :)
 * It creates a symbol table that string players would be willing to take home to
 * their mothers.
 * Template variables:
 *  - "fret.index":  fret index starting at 0
 *  - "fret.offset": the MIDI representation of this fret
 *  - "string.index": index of the string in `strings`
 *  - "string.name": optional name. Will default to "s[{string.index}]"
 */
export class TinyStringedInstrument implements TinyInstrument {
	/**
	 * Allows alternate symbol table symbols. By default: s[index]
	 */
	public readonly format: string;
	private readonly formatter: _.TemplateExecutor;
	/**
	 * Total number of symbol table entries that will be created per string
	 */
	public readonly fretCount: number;
	/**
	 * Amount we increment each offset per fret
	 */
	public readonly fretWidth: number;
	public readonly strings: TinyInstrumentString[];

	/**
	 * Creates instance of TinyStringedInstrument
	 */
	constructor({
		format = '{string.name}[{fret.index}]',
		fretCount = 24,
		fretWidth = 1,
		strings,
	}: {
		format?: string;
		fretCount?: number;
		fretWidth?: number;
		strings: TinyInstrumentString[];
	}) {
		function compileFormatter(): _.TemplateExecutor {
			_.templateSettings.interpolate = /{([\s\S]+?)}/g;
			return _.template(format);
		}

		this.format = format;
		this.formatter = compileFormatter();
		this.fretCount = fretCount;
		this.fretWidth = fretWidth;
		this.strings = strings;
	}

	public generate(): SymbolMap<string> {
		return this.strings.reduce<SymbolMap<string>>((map, string, stringIndex) => {
			const properties = {
				fret: {
					index: 0,
					offset: string.offset,
				},
				string: {
					index: stringIndex,
					// we'll default it and let it be overridden if it is in `string`.
					name: `s[${stringIndex}]`,
					...string,
				},
			};
			for (
				properties.fret.index;
				properties.fret.index < this.fretCount;
				properties.fret.index++
			) {
				const symbolKey = this.formatter(properties);
				map[symbolKey] = properties.fret.offset.toString();
				properties.fret.offset += this.fretWidth;
			}
			return map;
		}, {});
	}
}
