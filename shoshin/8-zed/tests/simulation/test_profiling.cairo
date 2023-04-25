%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.cairo_builtins import HashBuiltin

from contracts.engine import loop
from lib.bto_cairo_git.lib.tree import Tree

@external
func __setup__{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    %{
        import importlib  
        utils = importlib.import_module("tests.utils")
        context.parse_agent = utils.parse_agent
    %}
    return();
}

@external
func test_simulation{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    alloc_locals;

    local combos_offset_len_0: felt;
    let (local combos_offset_0) = alloc();
    local combos_len_1: felt;
    let (local combos_0) = alloc();
    local combos_offset_len_1: felt;
    let (local combos_offset_1) = alloc();
    local combos_len_0: felt;
    let (local combos_1) = alloc();

    local state_machine_offsets_len_0: felt;
    let (local state_machine_offsets_0) = alloc(); 
    local state_machine_len_0: felt;
    let (local state_machine_0) = alloc();
    local state_machine_offsets_len_1: felt;
    let (local state_machine_offsets_1) = alloc(); 
    local state_machine_len_1: felt;
    let (local state_machine_1) = alloc();

    local functions_offsets_len_0: felt;
    let (local functions_offsets_0) = alloc();
    local functions_len_0: felt;
    let (local functions_0) = alloc();
    local functions_offsets_len_1: felt;
    let (local functions_offsets_1) = alloc();
    local functions_len_1: felt;
    let (local functions_1) = alloc();

    local actions_len_0: felt;
    let (local actions_0) = alloc();
    local actions_len_1: felt;
    let (local actions_1) = alloc();

    %{
        from starkware.cairo.lang.vm.memory_segments import MemorySegmentManager
        memory_segments = MemorySegmentManager(memory, PRIME)

        (
            combos_offset_0,
            combos_0,
            state_machine_offsets_0,
            state_machine_0,
            functions_offsets_0,
            functions_0,
            actions_0,
        ) = context.parse_agent("./experiments/advanced_agent_antoc.json");

        flatten_state_machine_0 = [element for sublist in state_machine_0 for element in sublist]
        flatten_function_0 = [element for sublist in functions_0 for element in sublist]

        ids.combos_offset_len_0 = len(combos_offset_0)
        ids.combos_len_0 = len(combos_0)
        ids.state_machine_offsets_len_0 = len(state_machine_offsets_0)
        ids.state_machine_len_0 = len(state_machine_0)
        ids.functions_offsets_len_0 = len(functions_offsets_0)
        ids.functions_len_0 = len(functions_0)
        ids.actions_len_0 = len(actions_0)

        memory_segments.write_arg(ids.combos_offset_0, combos_offset_0);
        memory_segments.write_arg(ids.combos_0, combos_0);
        memory_segments.write_arg(ids.state_machine_offsets_0, state_machine_offsets_0);
        memory_segments.write_arg(ids.state_machine_0, flatten_state_machine_0);
        memory_segments.write_arg(ids.functions_offsets_0, functions_offsets_0);
        memory_segments.write_arg(ids.functions_0, flatten_function_0);
        memory_segments.write_arg(ids.actions_0, actions_0);

        (
            combos_offset_1,
            combos_1,
            state_machine_offsets_1,
            state_machine_1,
            functions_offsets_1,
            functions_1,
            actions_1,
        ) = context.parse_agent("./experiments/advanced_agent_jessica.json");

        flatten_state_machine_1 = [element for sublist in state_machine_1 for element in sublist]
        flatten_function_1 = [element for sublist in functions_1 for element in sublist]

        ids.combos_offset_len_1 = len(combos_offset_1)
        ids.combos_len_1 = len(combos_1)
        ids.state_machine_offsets_len_1 = len(state_machine_offsets_1)
        ids.state_machine_len_1 = len(state_machine_1)
        ids.functions_offsets_len_1 = len(functions_offsets_1)
        ids.functions_len_1 = len(functions_1)
        ids.actions_len_1 = len(actions_1)

        memory_segments.write_arg(ids.combos_offset_1, combos_offset_1);
        memory_segments.write_arg(ids.combos_1, combos_1);
        memory_segments.write_arg(ids.state_machine_offsets_1, state_machine_offsets_1);
        memory_segments.write_arg(ids.state_machine_1, flatten_state_machine_1);
        memory_segments.write_arg(ids.functions_offsets_1, functions_offsets_1);
        memory_segments.write_arg(ids.functions_1, flatten_function_1);
        memory_segments.write_arg(ids.actions_1, actions_1);
    %}

    let tree_state_machine_0 = cast(state_machine_0, Tree*);
    let tree_state_machine_1 = cast(state_machine_1, Tree*);
    let tree_functions_0 = cast(functions_0, Tree*);
    let tree_functions_1 = cast(functions_1, Tree*);

    loop(
        120, 
        combos_offset_len_0, 
        combos_offset_0, 
        combos_len_0, 
        combos_0, 
        combos_offset_len_1, 
        combos_offset_1, 
        combos_len_1, 
        combos_1, 
        state_machine_offsets_len_0, 
        state_machine_offsets_0, 
        state_machine_len_0, 
        tree_state_machine_0, 
        0, 
        state_machine_offsets_len_1, 
        state_machine_offsets_1, 
        state_machine_len_1, 
        tree_state_machine_1, 
        0, 
        functions_offsets_len_0, 
        functions_offsets_0, 
        functions_len_0, 
        tree_functions_0, 
        functions_offsets_len_1, 
        functions_offsets_1, 
        functions_len_1, 
        tree_functions_1, 
        actions_len_0, 
        actions_0, 
        actions_len_1, 
        actions_1, 
        1, 
        0
    );
    
    return();
}