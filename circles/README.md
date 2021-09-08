# Tiny Circles

## Overview 

It's a simple markup language for describing velocity cycles that cycle in the shape of a circle (or more accurately ellipses).

## Language

It knows of two object types: _project_ and _circle_. `project:` is a reserved keyword whereas circles are 
dynamically named. All named objects that are not `project` are assumed to be a circle. We will dig into the
grammar below. 


### Grammar

The grammar is a lot like ini files which used to (and may still be used) as configuration files by windows.

`*` - property values prefaced with `*` are optional.

**Types**

- _Number_ => `\d+`
- _NumericValue_ => `(Number|Symbol)`
- _NumericArray_ => `([NumericValue, ...]|ValueServer)`
- _Reserved_ => _See core's common_ [symbols](https://github.com/celsasser/tiny-midi-suite.git/core/tree/master/res/symbols)
- _String_ => (any combination of printable characters)
- _Symbol_ => `([a-zA-Z$_-][0-9a-zA-Z$_-]*|Reserved)`

**Comments**

- _line_ => `^\s*#.+$`
- _inline (limited support)_ => `^(code)\s+#.+$`

Comments should mostly be limited to line comments and not inline comments. The reason being
that `#` is allowed character in symbol names (c#). So, where symbol names _may_ be used
avoid inline comments 'cause we don't parse them.

**Project Definition**

Project metadata as well as some control properties

```
project:
* name: String
* length: PPQ|M:N|M:B:N     # length of song in our duration spec
```

**Circle Definition**

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
