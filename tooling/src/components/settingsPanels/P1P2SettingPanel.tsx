import React from "react";
import styles from "../../../styles/StatusBar.module.css";
import "../../../styles/StatusBar.module.css";
import { SingleMetadata } from "../../types/Metadata";
import { AgentOption, SetPlayerBar } from "./settingsPanel";


interface P1P2SettingPanelProps {
    agentsFromRegistry: SingleMetadata[],
    //Temporary type awkwardness since league db has agent names but user submitted does not
    // Will eventually be SingleMetadata when agent names are added to registry
    leagueAgents: any[],
    agentChange: (whichPlayer: string, value: AgentOption) => void
}


const P1P2SettingPanel = ({
    agentsFromRegistry,
    agentChange,
    leagueAgents
}  : P1P2SettingPanelProps) => {

    return (
        <div style={{marginBottom:'10px'}}>
            <div className={styles.statusBarRow}>
                <SetPlayerBar label={'Select Player 1'} agentsFromRegistry={agentsFromRegistry} leagueAgents={leagueAgents} agentChange={(value) => agentChange('P1', value)}/>
                <SetPlayerBar label={'Select Player 2'} agentsFromRegistry={agentsFromRegistry} leagueAgents={leagueAgents} agentChange={(value) => agentChange('P2', value)}/>
            </div>
        </div>
    );
};



export default P1P2SettingPanel;
