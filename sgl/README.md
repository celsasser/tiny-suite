# Tiny

## Draft
I am a big dummy. I tore this out of a larger MIDI "compiler" called [pig-pen](https://github.com/celsasser/pig-pen-server) (see [tiny](https://github.com/celsasser/pig-pen-server/tree/master/src/song/tiny)). That was in the context of a scripting environment. This is not and the grammar isn't very useful as it is. I started thinking a little about support for some operations that could help but need to give it some thought:

_TODO: I have build script handling into [crow](../crow/src/machine/script.ts). We can 
do something very similar to that and allow these guys to be run in a javascript 
context._

### Repitition
Repeat a sequence. Here are some sketches:

**Post Operand**

`a (+ b) * 3` => `a + b + b + b`

**Pre Operand**

Note the dangling `10`. You will see the need in the
expansion.

`a + (b + ) * 3 10` => `a + b + b + b + 10`

**Split Operations?**

Is there value? Think we should start simple and not include support for splitting.

`a + (^ 10) * 5`

**Grammar:**

Just some rough sketching

_operation -> (operations operandExpression) | +, -, ^..._
_operand -> (operand operationExpression) | /operand/_

### Assignment

Is there a useful way to include the assignment operator `=`?

## Overview
Tiny SGL is a little sequence generation language. Think music math, but hopefully less awful than that sounds.

## Specification

### Operators
* `+` adds r-value to accumulator value
* `-` subtracts r-value from accumulator value
* `*` multiply r-value to accumulator value
* `^` insert accumulator value into sequence
* `$+` push accumulator onto the stack
* `$-` pops stack into the accumulator

The order of opererators matters. You may think of them as a sequence of operations. An example will say a thousand words:
* `[10 ^+ 5]` => `[10]` _- the insert operation is executed before the add operation_
* `[10 +^ 5]` => `[15]` _- the insert operation is executed after the add operation_
* `[10 + 5 ^]` => `attempt to parse 10 + 5 ^ failed. failure point =`. Ideally, we would treat `^`, `$+` and `$-` as unary operations.
  But, we don't. All operators are treated as binary operations.

## Instruments

We create some alternate means of creating sequences via symbol tables. For more information see our Instrument's [readme](./src/instrument/readme.md).
