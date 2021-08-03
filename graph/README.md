# Tiny GTS (grammar to stream?)

## Draft
It's a simple markup language for describing graphs and parameters for their execution

## Language
It's a simple little flellow for defining _vertexes_ and _edges_. And then to connect them.

Let's beging with the "graph" part. It is a graph but we allow a vertext or vertex's edge
to execute in a `poly` mode in which we traverse all nodes belonging to a particular `vertex`.
Our language is pretty immature. And I have created a pretty basic set of functions that you
may use to spice things up.

Limitations:
1. Parsing is very basic. We do dig deep to resolve symbols. But we don't support functions within functions.
	We shall see where it all goes before rushing in with all guns blazing.
2. Don't allow user to create their own symbols. It's a simple addition should this guy's maiden voyage
   shows promise.

### Grammar

The grammar is a lot like ini files which used to (and may still be used) as configuration files by windows.

`*` - property values prefaced with `*` are optional.

**Types**
* *Cardinality* => `(mono|poly)`
* *Number* => `\d+`
* *NumericValue* => `(Number|Reserved|Symbol)`
* *NumericArray* => `(\[NumericValue, ...\]|ValueServer)`
* *Option* => `(cycle|reuse)`
* *Range* => `\[number|symbol - number|symbol\]`
* *Reserved* => _See core's common_ [symbols](https://github.com/celsasser/tiny-core-module/tree/master/res/symbols)
* *String* => (any combination of printable characters)
* *Symbol* => `([a-zA-Z$_-][0-9a-zA-Z$_-]*|Reserved)`

**Comments**
* *line* => `^\s*#.+$`
* *inline (limited support)* => `^(code)\s+#.+$`

Comments should mostly be limited to line comments and not inline comments. The reason being
that `#` is allowed character in symbol names (c#). So, where symbol names _may_ be used
avoid inline comments 'cause we don't parse them.

**Project Definition**

Project metadata as well as some control properties

```
project:
start: Vertext-SymbolName   # starting place for playback
* name: String
* steps: NumericValue       # number of steps through the graph before iteration stops
```

**Vertext Definition**

A vertex which is where notes with friends are defined. Vertexes are joined by edges.

```
<SymbolName>:
* channel: NumericValue
* name: String
* notes: NumericArray
* transition: Cardinality
* velocity: NumericArray
* weights: NumericArray
```

**Edge Definition**

Combines two vertices

```
* name: String
* panOffset: NumericArray
* velocityOffset: NumericArray
* weight: NumericArray
```
**Value Servers**

They are functions that returns values with varying degrees of reliability.
Our suite of functions and their params and return values are as follows:


* *cycle* =>
  * `cycle(elements: Array<number|symbol|Array<number|symbol>>)`
  * `cycle(range: Range)`
* *not* =>
  * `not(values: Array<number|symbol>, range: Range, options?: Option[])`
* *randomGrouping* =>
  * `randomGrouping(values: number[]|range, count: range, options?: Option[])`
  * `randomGrouping(values: number[]|range, count: range, weights: number[], options?: Option[])`
* *randomSelection* =>
  * `randomSelection(values: Array<number|symbol|Array<number|symbol>>`
  * `randomSelection(values: Array<number|symbol|Array<number|symbol>>, options: Option[])`
  * `randomSelection(values: Array<number|symbol|Array<number|symbol>>, weights: number[])`
  * `randomSelection(values: Array<number|symbol|Array<number|symbol>>, weights: number[], options: Option[])`

