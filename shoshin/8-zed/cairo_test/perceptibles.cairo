from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.dict import dict_write
from starkware.cairo.common.dict_access import DictAccess
from cairo_test.constants.constants import Perceptibles, ns_perceptibles

func update_perceptibles{range_check_ptr}(perceptibles: DictAccess*, p: Perceptibles) -> (
    perceptibles_new: DictAccess*
) {
    // SELF
    // Self position update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_X_POS, new_value=p.self_physics_state.pos.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_Y_POS, new_value=p.self_physics_state.pos.y
    );

    // Self velocity update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_VEL_X, new_value=p.self_physics_state.vel_fp.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_VEL_Y, new_value=p.self_physics_state.vel_fp.y
    );

    // Self acceleration update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_ACC_X, new_value=p.self_physics_state.acc_fp.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_ACC_Y, new_value=p.self_physics_state.acc_fp.y
    );

    // Self direction update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_DIR, new_value=p.self_body_state.dir
    );

    // Self integrity update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_INT, new_value=p.self_body_state.integrity
    );

    // Self stamina update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_STA, new_value=p.self_body_state.stamina
    );

    // Self body state update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_BODY_STATE, new_value=p.self_body_state.state
    );

    // Self body counter update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_BODY_COUNTER, new_value=p.self_body_state.counter
    );

    // Self combo update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_CURRENT_COMBO, new_value=p.self_combo.combo_index
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.SELF_COMBO_COUNTER, new_value=p.self_combo.action_index
    );

    // OPPONENT
    // Opponent position update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_X_POS, new_value=p.opponent_physics_state.pos.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_Y_POS, new_value=p.opponent_physics_state.pos.y
    );

    // Opponent velocity update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_VEL_X, new_value=p.opponent_physics_state.vel_fp.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_VEL_Y, new_value=p.opponent_physics_state.vel_fp.y
    );

    // Opponent acceleration update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_ACC_X, new_value=p.opponent_physics_state.acc_fp.x
    );
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_ACC_Y, new_value=p.opponent_physics_state.acc_fp.y
    );

    // Opponent direction update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_DIR, new_value=p.opponent_body_state.dir
    );

    // Opponent integrity update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_INT, new_value=p.opponent_body_state.integrity
    );

    // Opponent stamina update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_STA, new_value=p.opponent_body_state.stamina
    );

    // Opponent body state update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_BODY_STATE, new_value=p.opponent_body_state.state
    );

    // Opponent body counter update
    dict_write{dict_ptr=perceptibles}(
        key=ns_perceptibles.OPPONENT_BODY_COUNTER, new_value=p.opponent_body_state.counter
    );
    return (perceptibles_new=perceptibles);
}
