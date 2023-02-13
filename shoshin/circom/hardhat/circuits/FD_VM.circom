pragma circom 2.0.0;

/**
* @return - return whether `inp` is an opcode and its memory requirement by (1, <<MEM_REQUIREMENT>>). Otherwise return (0, 0)
*/
function parse_stack_inp(inp) {
	// TODO: impl
	return (1, 2);
}

/*This circuit template checks that c is the multiplication of a and b.*/  

// TODO: MAX STACK SIZE same as prog max steps? (because ops never increase size of stack)
template FD_VM (PROG_MAX_STEPS, INP_PROG_SIZE, MAX_STACK_SIZE, INPUT_SIZE) {  

   // Declaration of signals.  
   signal input program[PROG_MAX_STEPS];
   signal input inputs[INP_PROG_SIZE];
   signal output next_mind;
   signal output next_intent;

	// We only ever need to pop off 5 elements and work with them in Stack Machines
	// The first is the opcode for the expression
	// The next two are the return values if the expression is a conditional, if not they are the values to operate on
	// The last two are the values to operate on if the opcode is a conditional
	var memory[5];
	var stack[MAX_STACK_SIZE];

	var stack_ptr = 0;
  var memory_idx = 0;
	var opcode_memory_limit = 0;

	//  0 indicates unset
	var out_mind = 0;
	//  0 indicates unset
	var out_intent = 0;

	for (i = 0; i < PROG_MAX_STEPS; i++) {
		var is_opcode, mem_size = parse_stack_inp(program[i]);

		// The statement is a conditional with returns
		if (is_opcode = 1 && mem_size = 4) {
			var a = stack[stack_ptr - 3];
			var b = stack[stack_ptr - 2];
			var out_mind_curr = stack[stack_ptr - 1]; // 0 if the condition should not return for mind
			var out_intent_curr = stack[stack_ptr]; // 0 if the condition should not return for inent
			stack_ptr -= 4; // Wipes everything off of the stack

			if (out_mind > 0) {
				out_mind = out_intent_curr;
			}
			if (out_intent_curr > 0) {
				out_intent = out_intent_curr;
			}

		} else if (is_opcode = 1 && mem_size = 2) { // An operation on the stack with 2 inputs
			var a = stack[stack_ptr - 1];
			var b = stack[stack_ptr];
			stack_ptr -= 1;
			stack[stack_ptr] = 0; // TODO: impl
		} else if (is_opcode == 1 && mem_size == 1) { // An operation on the stack with 1 input, stack_ptr remains constant
			stack[stack_ptr] = 0; // TODO: impl
		} else {
			stack[stack_ptr] = program[i];
			stack_ptr += 1;
		}
	}
	next_mind <== out_mind;
	next_intent <== out_intent;
}