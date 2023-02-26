# Circom and Associated Tooling for Shoshin

## High Level

This folder contains the circuits, tests, and tooling for Shoshin. The `circuits` folder
contains Circom and tests and the `src` (will) contain tooling in Typescript. Tooling will be used to compile
Shoshin inputs into Circom friendly representations.

## `FD Emulator` Overview

We need our Circom to verify that an FD emulator ran correctly. We do this by specifying a "byte code" associated with each FD. Note that running an FD can be thought of as running some input on a program. Thus, we can have `inputs` and `program instructions`. Circuits can be programmed with [multiplexers](https://en.wikipedia.org/wiki/Multiplexer). We represent the `program instructions` as selection wires for multiplexers. Essentially, the selector inputs specify which inputs get fed into which operations and which operations are used, similar to a CPU!

### The specifics

Below we outline the inputs to the `FD Emulator` circuit. The outputs can be broken down into 2 categories: `inputs` and `trace` selectors. We can think of traces as the circuit equivalent of trace cells in Cairo. Essentially, they are write once values that store intermediary computations. The output of the circuit is the last trace cell's output. Because we are working with circuits, we have a **constant** number of **trace cells** and **inputs**.

Unused inputs can be set to 0. Unused trace cells should have their `type` (OpCode) set to 0 which signifies that the output should be the first input. The inputs to the unused trace cells should be the output of the prior trace cell.
Inputs to trace cells are based off of indexing. Setting an input selector to be in the range of [0, NUMB_INPUTS) signifies that the trace cell's input is selecting from the inputs to the circuit. Setting a trace cell's input selector to index i in [NUMB_INPUTS, NUMB_INPUTS + NUMB_TRACE_CELLS) signifies setting the input selector to the output of trace cell i minus NUMB_INPUTS.

> Note that trace cells can only use outputs of trace cells with smaller indices. I.e. trace cell 10 can only use the outputs from trace cells 0 to 9.

So, for this example, we have 8 inputs and 5 trace cells.
The example computes |-10| + (30 / -10) = 3.

```typescript
{
  inputs: [-10, 20, 30, 40, 50, 60, 0, 0],
  trace_inp_selectors: [
    [0, 1], // select -10
    [2, 0], // select 30 and -10
    [8, 9], // select trace_0 out and trace_1 out
    [10, 0], // dummy pass through, output trace_2
    [11, 0], // dummy pass through, output trace_3
    [12, 0], // dummy pass through, output trace_4
  ],
  trace_type_selectors: [
    OpCodes.ABS,
    OpCodes.DIV,
    OpCodes.ADD,
    0, // Pass through op
    0, // Pass through op
  ],
}
```

#### Circuit Block Diagram

The following block diagram also gives a high level overview of how the circuit works
![imgs/FDBlockDiagram.png](imgs/FDBlockDiagram.png)

### From Directed Acyclic Graph (DAG) Programs to Circom

To get from a DAG program, as used in Shoshin, to the Circom we will use a simple compiler. All the compiler has to do is define the order of the trace cells such that the computations in the DAG with larger depth get computed in the trace **_before_** the more shallow nodes. This will be specified in more detail in Part 2 of this pull request.
