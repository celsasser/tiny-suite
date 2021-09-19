# Tiny Circles

## Overview

It's a simple markup language for describing velocity cycles that cycle in the shape of a circle or more accurately ellipses.

## Language

It knows of two object types: _project_ and _circle_. _project_ is a reserved keyword whereas circles are
dynamically named. All named objects that are not _project_ are assumed to be circles. We will dig into the
grammar below.

### Grammar/Syntax

The grammar and syntax is a lot like Windows old INI grammar and syntax.

`*` - property values prefaced with `*` are optional.

**Types**

- _Number_ => `\d+`
- _NumericValue_ => `(Number|Symbol)`
- _NumericArray_ => `([NumericValue, ...]|ValueServer)`
- _Reserved_ => _See core's common_ [symbols](../core/res/midi/symbols)
- _String_ => (any combination of printable characters)
- _Symbol_ => `([a-zA-Z$_-][0-9a-zA-Z$_-]*|Reserved)`

**Comments**

- _line_ => `^\s*#.+$`
- _inline (limited support)_ => `^(code)\s+#.+$`

Comments should mostly be limited to line comments and not inline comments. The reason being
that `#` is allowed character in symbol names (c#). So, where symbol names _may_ be used
avoid inline comments 'cause we don't parse them.

**Defaults**
Please see core for [defaults](../core/res/midi/symbols/defaults.json).

**Project Definition**

Project metadata as well as some control properties

```gitignore
project:
# The total length described in our PPQ|B:N|B:M:N spec
length = <PPQ>|<M:N>|<M:B:N>
*name = String
# Defaults to core's default PPQ
*ppq = Number
# Defaults to core's default timesignature
*timesignature = Number/Number
```

**Circle Definition**

A vertex which is where notes with friends are defined. Vertexes are joined by edges.

```gitignore
<CircleName:Symbol>:
# Defaults to core's default channel
*channel = NumericValue
*description = String
diameter = <PPQ>|<M:N>|<M:B:N>
divisions = Number
# Maximum velocity value 
*max = Number
# Minimum velocity value 
*min = Number
notes = NumericValue|NumericArray
# Off-time per note duration. Must be less than "on" time 
*off = <PPQ>|<M:N>|<M:B:N>
# On-time per note duration. Defaults to diameter/divisions 
*on = <PPQ>|<M:N>|<M:B:N>
*phase = Number
*shape = high-to-low|low-to-high|high-to-low-on-to-off|low-to-high-on-to-off|high-to-low-off-to-on||low-to-high-off-to-on
```
