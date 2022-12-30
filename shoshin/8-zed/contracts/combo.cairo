%lang starknet

from contracts.constants.constants import ComboBuffer
from starkware.cairo.common.math import unsigned_div_rem

func _combo{range_check_ptr}(combo_number: felt, combos: ComboBuffer) -> (
    action: felt, combos_new: ComboBuffer
) {
    alloc_locals;
    local index;
    local combos_new: ComboBuffer;

    let offset = combos.combos_offset[combo_number - 1];
    let l = combos.combos_offset[combo_number] - combos.combos_offset[combo_number - 1];
    if (l == 1) {
        assert index = 0;
        tempvar range_check_ptr = range_check_ptr;
    } else {
        let (_, r) = unsigned_div_rem(combos.combo_counter, l);
        assert index = r;
        tempvar range_check_ptr = range_check_ptr;
    }
    let a_0 = combos.combos[offset + index];

    if (combo_number == combos.current_combo) {
        assert combos_new = ComboBuffer(combos.combos_offset_len, combos.combos_offset, combos.combos, combo_number, index + 1);
        tempvar range_check_ptr = range_check_ptr;
    } else {
        assert combos_new = ComboBuffer(combos.combos_offset_len, combos.combos_offset, combos.combos, combo_number, 1);
        tempvar range_check_ptr = range_check_ptr;
    }
    return (a_0, combos_new);
}
