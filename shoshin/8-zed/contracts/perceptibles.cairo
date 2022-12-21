%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.dict import dict_write
from starkware.cairo.common.dict_access import DictAccess
from contracts.constants import Perceptibles, ns_perceptibles

func update_perceptibles{range_check_ptr}(perceptibles: DictAccess*, p: Perceptibles) -> (
    perceptibles_new: DictAccess*
) {
    // SELF
    // Self position update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_X_POS, new_value=p.self_character_state.pos.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_Y_POS, new_value=p.self_character_state.pos.y
    );

    // Self velocity update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_VEL_X, new_value=p.self_character_state.vel_fp.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_VEL_Y, new_value=p.self_character_state.vel_fp.y
    );

    // Self acceleration update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_ACC_X, new_value=p.self_character_state.acc_fp.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_ACC_Y, new_value=p.self_character_state.acc_fp.y
    );

    // Self direction update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_DIR, new_value=p.self_character_state.dir
    );

    // Self integrity update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_INT, new_value=p.self_character_state.int
    );

    // Self object state update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_STATE, new_value=p.self_object_state
    );

    // OPPONENT
    // Opponent position update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_X_POS, new_value=p.opponent_character_state.pos.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_Y_POS, new_value=p.opponent_character_state.pos.y
    );

    // Opponent velocity update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_VEL_X, new_value=p.opponent_character_state.vel_fp.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_VEL_Y, new_value=p.opponent_character_state.vel_fp.y
    );

    // Opponent acceleration update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_ACC_X, new_value=p.opponent_character_state.acc_fp.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_ACC_Y, new_value=p.opponent_character_state.acc_fp.y
    );

    // Opponent direction update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_DIR, new_value=p.opponent_character_state.dir
    );

    // Opponent integrity update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_INT, new_value=p.opponent_character_state.int
    );

    // Opponent object state update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_STATE, new_value=p.opponent_object_state
    );
    return (perceptibles_new=perceptibles);
}
