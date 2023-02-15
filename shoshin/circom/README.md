# Circom and Associated Tooling for Shoshin

## High Level

This folder contains the circuits, tests, and tooling for Shoshin. The `circuits` folder
contains Circom and tests and the `src` (will) contain tooling in Typescript. Tooling will be used to compile
Shoshin inputs into Circom friendly representations.

## `FD Emulator` Overview

We need our Circom to verify that an FD emulator ran correctly. We do this by specifying a "byte code" associated with each FD. Note that running an FD can be thought of as running some input on a program. Thus, we can have `inputs` and `program instructions`. Circuits can be programmed with [multiplexers](https://en.wikipedia.org/wiki/Multiplexer). We represent the `program instructions` as selection wires for multiplexers. Essentially, the selector inputs specify which inputs get fed into which operations and which operations are used, similar to a CPU!

### The specifics

`FD_Emulator` takes as input

```typescript
{
  /**
   * The value of the next state associated with each conditional and the default
   * The first NumberOfConditional values are associated with conditionals. The last one is a default
   */
  next_state: [Number of Conditionals + 1], // length of Number of Conditionals + 1
  /**
  * The input to the circuit
  */
  inputs: [Input Size].


	/**
   * Select how to `and` the conditionals. Essentially, every single clause conditional can be transformed into a multi clause conditional
   * by selecting which get `anded` together. The selection index ranges from [0, Number of Conditional + 2) where setting
   * the selection to NumberOfConditionals is hardwired to `true` and NumberOfConditionals+1 is hardwired to `false`
   *
   * The and conditionals are the ones that are finally associated with the output
   */
  and_selectors: [Number of Conditionals][Max Number of And Clauses],

	/**
   * Selects which conditional to use for each conditional:
   * [0, 0] (0) represent a == b
   * [1, 0] (1) represents a < b
   * [0, 1] (2) represents a <= b
   * [1, 1] (3) represents a != b
   */
  conditional_mux_sel: [Number of Conditionals][2],

  /**
   * for each conditional, a ?= b, select `a` and `b`. Selection values range
   * from Number of Conditionals + Number of Buffers, where i in [0, Number of Conditionals) selects the ith input and i in [Number of Conditionals, Number of Conditionals + Number of Buffers) selects the i - Number of Conditionals buffer.
  */
  conditional_inputs_mux_sel[Number of Conditionals][2],

  /**
  * Each buffer can operate on at most 3 elements. This selects the inputs for each buffer.
  * For buffer i in [0, Buffer Size), the selector takes Input Size + i possible values.
  * The first Input Size represent selecting from an input. For j in [Input Size, Input Size + i), j represents selecting the output of buffer `j - Input Size`
  */
  buffer_mux_sel: [Buffer Size][3],
  /**
  * Each buffer can take input, a, b, and c.
  *
  * The different types associated with the buffers are
  *
  * [0, 0] => a * b + c
  * [1, 0] => |a|
  * [0, 1] => a \ b (integer division)
  * [1, 1] => a % b
  */
  buffer_type_sel: [Buffer Size][2],

}
```
