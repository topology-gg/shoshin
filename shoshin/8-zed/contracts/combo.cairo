%lang starknet

from contracts.constants.constants import ComboBuffer
from starkware.cairo.common.math import unsigned_div_rem

func _combo{range_check_ptr}(combo_number: felt, combos: ComboBuffer) -> (
    action: felt, combos_new: ComboBuffer
) {
    alloc_locals;
    // index in the current combo
    local index;
    local combos_new: ComboBuffer;

    // combo numbering starts at 1
    // retrieve the offset of the combo
    let offset = combos.combos_offset[combo_number - 1];
    // retrieve the length of the current combo
    let l = combos.combos_offset[combo_number] - offset;
    if (l == 1) {
        assert index = 0;
        tempvar range_check_ptr = range_check_ptr;
    } else {
        let (_, r) = unsigned_div_rem(combos.combo_counter, l);
        assert index = r;
        tempvar range_check_ptr = range_check_ptr;
    }
    // get the action of the combo using offet and index
    let a_0 = combos.combos[offset + index];

    // if combo stays stays the same, increment the index
    if (combo_number == combos.current_combo) {
        assert combos_new = ComboBuffer(combos.combos_offset_len, combos.combos_offset, combos.combos, combo_number, index + 1);
        tempvar range_check_ptr = range_check_ptr;
        // else if combo changes, reset the index at 1
    } else {
        assert combos_new = ComboBuffer(combos.combos_offset_len, combos.combos_offset, combos.combos, combo_number, 1);
        tempvar range_check_ptr = range_check_ptr;
    }
    return (a_0, combos_new);
}
