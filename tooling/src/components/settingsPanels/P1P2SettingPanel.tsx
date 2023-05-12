import React from "react";
import styles from "../../../styles/StatusBar.module.css";
import "../../../styles/StatusBar.module.css";
import { SingleMetadata } from "../../types/Metadata";
import { AgentOption, SetPlayerBar } from "./settingsPanel";


interface P1P2SettingPanelProps {
    agentsFromRegistry: SingleMetadata[]
    agentChange: (whichPlayer: string, event: object, value: AgentOption) => void
}


const P1P2SettingPanel = ({
    agentsFromRegistry,
    agentChange
}  : P1P2SettingPanelProps) => {

    return (
        <div style={{marginBottom:'10px'}}>
            <div className={styles.statusBarRow}>
                <SetPlayerBar label={'P1'} agentsFromRegistry={agentsFromRegistry} agentChange={(event, value) => agentChange('P1', event, value)}/>
                <SetPlayerBar label={'P2'} agentsFromRegistry={agentsFromRegistry} agentChange={(event, value) => agentChange('P2', event, value)}/>
            </div>
        </div>
    );
};



export default P1P2SettingPanel;
