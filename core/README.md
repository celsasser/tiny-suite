# Tiny Sequence Generation Language

## Overview
Tiny is a tiny little scripting language that we support. Think music math, but hopefully less awful than that sounds.

We do not keep him within our [API](../api).  Cause we don't need all of the bits and pieces that make his little engine go. Instead, we expose a single endpoint for generating sequences called [generateTinySequence](./index.ts).  He's the one shop that you need to stop at for everything you could want to buy.  Instruments are an exception. We do export them so that we can use them via scripts.

## Specification

### Operators
* `+` add to accumulator value
* `-` subtract from accumulator value
* `*` multiply to accumulator value
* `^` insert accumulator value into sequence
* `$+` push accumulator onto the stack
* `$-` pops stack into the accumulator


## Instruments

We create some alternate means of creating sequences via symbol tables. For more information see our Instrument's [readme](./instrument/readme.md).
