import { useState } from 'react';
import { Character } from '../../constants/constants';
import Agent from '../../types/Agent';
import { GameModes } from '../../types/Simulator';
import StatusBarPanel, { StatusBarPanelProps } from '../StatusBar';
import styles from '../../../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { ShoshinWASMContext } from '../../context/wasm-shoshin';
import React from 'react';

//@ts-ignore
const Game = dynamic(() => import('../../../src/Game/PhaserGame'), {
    ssr: false,
});

interface ArcadeProps {
    playerCharacter: number;
    opponent: Agent;
}
const Arcade = ({ playerCharacter, opponent }: ArcadeProps) => {
    const [playerStatuses, setPlayerStatuses] = useState<StatusBarPanelProps>({
        integrity_0: 1000,
        integrity_1: 1000,
        stamina_0: 100,
        stamina_1: 100,
    });

    const ctx = React.useContext(ShoshinWASMContext);
    if (ctx.wasm == undefined) {
        return <div> loading wasm context</div>;
    }
    return (
        <div className={styles.main}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <StatusBarPanel
                    integrity_0={playerStatuses.integrity_0}
                    integrity_1={playerStatuses.integrity_1}
                    stamina_0={playerStatuses.stamina_0}
                    stamina_1={playerStatuses.stamina_1}
                />
                <Game
                    testJson={undefined}
                    animationFrame={undefined}
                    animationState={undefined}
                    showDebug={false}
                    gameMode={GameModes.realtime}
                    realTimeOptions={{
                        playerCharacter,
                        agentOpponent: opponent,
                        setPlayerStatuses,
                    }}
                    isInView={true}
                />
            </div>
        </div>
    );
};

export default Arcade;
