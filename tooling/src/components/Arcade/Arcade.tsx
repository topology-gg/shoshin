import { ReactNode, useEffect, useState } from 'react';
import { Character } from '../../constants/constants';
import Agent from '../../types/Agent';
import { GameModes } from '../../types/Simulator';
import StatusBarPanel, { StatusBarPanelProps } from '../StatusBar';
import styles from '../../../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { ShoshinWASMContext } from '../../context/wasm-shoshin';
import React from 'react';
import PauseMenu from '../SimulationScene/PauseMenu';
import MidScreenKeybinding from '../MidScreenKeybinding';
import { buildAgentFromLayers } from '../ChooseOpponent/opponents/util';
import { OnlineOpponent, Opponent } from '../../types/Opponent';

//@ts-ignore
const Game = dynamic(() => import('../../../src/Game/PhaserGame'), {
    ssr: false,
});

interface ArcadeProps {
    playerCharacter: number;
    opponent: Opponent | OnlineOpponent;
    volume: number;
    pauseMenu: ReactNode;
}

const Arcade = React.forwardRef<HTMLDivElement, ArcadeProps>(
    ({ playerCharacter, opponent, volume, pauseMenu }, ref) => {
        const [playerStatuses, setPlayerStatuses] =
            useState<StatusBarPanelProps>({
                integrity_0: 1000,
                integrity_1: 1000,
                stamina_0: 100,
                stamina_1: 100,
            });

        const [openPauseMenu, changePauseMenu] = useState<boolean>(false);

        const [keyDownState, setKeyDownState] = useState<{
            [keyName: string]: boolean;
        }>({});

        const backgroundId =
            'backgroundId' in opponent ? opponent.backgroundId : 0;

        let p2: Agent;
        if ('layers' in opponent.agent) {
            const { layers, character, combos } = opponent.agent;
            const charIndex = character == Character.Jessica ? 0 : 1;
            p2 = buildAgentFromLayers(layers, charIndex, combos);
        } else {
            p2 = opponent.agent;
        }
        useEffect(() => {
            // keyup
            const handleKeyPress = (ev: KeyboardEvent) => {
                setKeyDownState((prev) => {
                    let prev_copy = JSON.parse(JSON.stringify(prev));
                    prev_copy[ev.key] = false;
                    return prev_copy;
                });

                const key = ev.key.toUpperCase();

                if (key.includes('ESCAPE')) {
                    changePauseMenu(!openPauseMenu);
                }
            };

            // keydown
            const handleKeyDown = (ev: KeyboardEvent) => {
                setKeyDownState((prev) => {
                    let prev_copy = JSON.parse(JSON.stringify(prev));
                    prev_copy[ev.key] = true;
                    return prev_copy;
                });
            };

            document.addEventListener('keyup', handleKeyPress);
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keyup', handleKeyPress);
                document.removeEventListener('keydown', handleKeyPress);
            };
        }, [openPauseMenu]);

        const ctx = React.useContext(ShoshinWASMContext);
        if (ctx.wasm == undefined) {
            return <div> loading wasm context</div>;
        }
        return (
            <div className={styles.main} ref={ref}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '800px',
                    }}
                >
                    {openPauseMenu ? pauseMenu : null}

                    {/* <StatusBarPanel
                        integrity_0={playerStatuses.integrity_0}
                        integrity_1={playerStatuses.integrity_1}
                        stamina_0={playerStatuses.stamina_0}
                        stamina_1={playerStatuses.stamina_1}
                    /> */}
                    <Game
                        testJson={undefined}
                        animationFrame={undefined}
                        showDebug={false}
                        gameMode={GameModes.realtime}
                        realTimeOptions={{
                            playerCharacter,
                            agentOpponent: p2,
                            setPlayerStatuses,
                        }}
                        isInView={true}
                        backgroundId={backgroundId ?? 0}
                        volume={volume}
                    />

                    <MidScreenKeybinding
                        realTimeCharacter={playerCharacter}
                        keyDownState={keyDownState}
                    />
                </div>
            </div>
        );
    }
);

export default Arcade;