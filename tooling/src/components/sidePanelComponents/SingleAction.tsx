import React from "react";
import { ACTIONS_ICON_MAP, CHARACTERS_ACTIONS } from "../../constants/constants";
import ActionToken from "./ActionToken";

const SingleAction = ({
    disabled,
    action,
    characterIndex
}) => {
    return (
        <>
        <ActionToken
            disabled={disabled}
            onClick={() => {}}
            selected={false}
        >
            <i className="material-icons" style={{ fontSize: "1rem" }}>
                {ACTIONS_ICON_MAP[CHARACTERS_ACTIONS[characterIndex][action]]}
            </i>
        </ActionToken>
        </>
    );
};

export default SingleAction;
