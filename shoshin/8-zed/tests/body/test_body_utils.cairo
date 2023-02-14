%lang starknet
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin
from starkware.cairo.common.bool import (TRUE, FALSE)
from contracts.constants.constants_antoc import (ns_antoc_action, ns_antoc_body_state, ns_antoc_stamina_effect, ns_antoc_body_state_duration)
from contracts.constants.constants import (BodyState, ns_stimulus, HURT_EFFECT, KNOCKED_EFFECT, ns_common_stamina_effect)
from contracts.body.body_antoc import _body_antoc
from contracts.body.body_utils import _settle_stamina_change

@external
func test_settle_stamina_change{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;    

    let (stamina, enough_stamina) = _settle_stamina_change(stamina = 1, stamina_change = 10, max_stamina = 10, is_add = TRUE);
    assert stamina = 10;
    assert enough_stamina = TRUE;
    
    let (stamina, enough_stamina) = _settle_stamina_change(stamina = 10, stamina_change = 10, max_stamina = 10, is_add = FALSE);
    assert stamina = 0;
    assert enough_stamina = TRUE;
    
    let (stamina, enough_stamina) = _settle_stamina_change(stamina = 9, stamina_change = 10, max_stamina = 10, is_add = FALSE);
    assert stamina = 0;
    assert enough_stamina = FALSE;
    
    return();

}