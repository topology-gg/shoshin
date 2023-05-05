import React from "react";
import styles from "../../../styles/StatusBar.module.css";
import "../../../styles/StatusBar.module.css";
import { SingleMetadata } from "../../types/Metadata";
import { AgentOption, SelectCharacterBar, SetPlayerBar } from "./settingsPanel";

interface RealTimeSettingPanelProps {
    agentsFromRegistry: SingleMetadata[]
    agentChange: (whichPlayer: string, event: object, value: AgentOption) => void
    changeCharacter : (character : string) => void
}


const RealTimeSettingPanel = ({
    agentsFromRegistry,
    agentChange,
    changeCharacter
}  : RealTimeSettingPanelProps) => {

    return (
        <div style={{marginBottom:'10px'}}>
            <div className={styles.statusBarRow}>
                <SelectCharacterBar label={'Select Character'} changeCharacter={(event, value) => changeCharacter(value.id)}/>
                <SetPlayerBar label={'P2'} agentsFromRegistry={agentsFromRegistry} agentChange={(event, value) => agentChange('P2', event, value)}/>
            </div>
        </div>
    );
};

export default RealTimeSettingPanel