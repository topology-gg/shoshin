# Circom and Associated Tooling for Shoshin

## Getting Setup

To get setup, you will need `node.js`, `npm` and packages surrounding Circom.

To get setup with `node.js` and `npm`, checkout [npmjs's documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/).
To get setup with Cricom, checkout [Circom's installation documentation](https://docs.circom.io/getting-started/installation/).

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

To get from a DAG program, as used in Shoshin, to the Circom we will use a simple compiler. The compiler has to define the order of the trace cells such that the computations in the DAG with larger depth get computed in the trace **_before_** the more shallow nodes.

As we can in the [BTO Cairo library](https://github.com/greged93/bto-cairo), the Cairo input is ordered as a list along the lines of something like

```
[{is_le, 1, 12}, {add, 1, 6}, {mul, 1, 4}, {pow, 1, 2}, {a, -1, -1}, {b, -1, -1}, {c, -1, -1}, {div, 1, 2}, {d, -1, -1}, {mod, 1, 2}, {e, -1, -1}, {f, -1, -1}, {abs, -1, 1}, {g, -1, -1}].

```

Simply speaking, each non-leaf item in the list contains the operation, its left child (input A into the operation) and its right child (input B). If an item has a `-1` specified for its left child, then it just takes in one input. If a node has `-1` for both its left and right child, then it is a leaf. We also have the potential for dictionary lookups. For more information, see the [BTO Cairo library](https://github.com/greged93/bto-cairo).

To understand how to get to the Cairo code, lets look at a sample DAG:
![imgs/SimpleDag.png](imgs/SimpleDag.png)
We can see each `leaf` as referencing a value (a value in a dictionary/ lookup table or a constant). Each node represents some computation. We can then translate the above into the language of input wires, mux selectors, and trace cells by ordering all nodes according to their depth. Nodes deeper in the DAG get associated to lower index trace cells. Thus, the ancestors of any node have _higher_ trace index than that node. Thus, the ancestors can access the node's computed output. So, for example, `node 6` in the above may be assigned to `trace cell 3` in the Circom. `node 4` may be assigned to `trace cell 4`. And, `node 3` can go to `trace cell 5`. The root gets assigned to the highest indexing trace cell.

For more details, `src/json_compiler.ts`.

### Running tests

To run the tests, first make sure to have Circom installed as well as the subfolder's NPM packages.

Then, after modifying any circuit or before running a suite of tests, run

```
npm run build-test-circuits
```

to build the testing circuits.

To run all the tests, run

```
npm run test
```

To run a specific test file, run

```
npm run test -- <PATH TO TEST FILE>
```

##### :warning: Word of Caution

`src/__tests__/fuzzing/random_program.spec.ts` takes around 20 minutes to run (at least on a 2021 Thinkpad with a Ryzen 7). The test creates random programs (100) and checks that they ran correctly. It also takes time to check that all the mind states committed to within a Merkle tree ran correctly.
