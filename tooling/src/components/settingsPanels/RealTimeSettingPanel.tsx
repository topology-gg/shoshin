import React from "react";
import styles from "../../../styles/StatusBar.module.css";
import "../../../styles/StatusBar.module.css";
import { SingleMetadata } from "../../types/Metadata";
import { AgentOption, SelectCharacterBar, SetPlayerBar } from "./settingsPanel";

interface RealTimeSettingPanelProps {
    agentsFromRegistry: SingleMetadata[]
    agentChange: (whichPlayer: string, event: object, value: AgentOption) => void
    changeCharacter : (character : string) => void
    // Comment in P1P2 Settings
    leagueAgents: any[],
}


const RealTimeSettingPanel = ({
    agentsFromRegistry,
    agentChange,
    changeCharacter,
    leagueAgents
}  : RealTimeSettingPanelProps) => {

    return (
        <div style={{marginBottom:'10px'}}>
            <div className={styles.statusBarRow}>
                <SelectCharacterBar label={'Select Character'} changeCharacter={(value) => changeCharacter(value)}/>
                <SetPlayerBar label={'Select Player 2'} agentsFromRegistry={agentsFromRegistry}leagueAgents={leagueAgents} agentChange={(event, value) => agentChange('P2', event, value)}/>
            </div>
        </div>
    );
};

export default RealTimeSettingPanel