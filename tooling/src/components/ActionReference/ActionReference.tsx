import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { Character } from '../../constants/constants';
import { Action, CHARACTERS_ACTIONS } from '../../types/Action';
import { useState } from 'react';
import FullArtBackground from '../layout/FullArtBackground';
import Tile, { TileContent } from '../ui/Tile';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import {
    comboInfosJessica,
    ComboInfo,
    comboInfosAntoc,
} from '../../types/ComboInfo';
import Actions from '../ComboEditor/Actions';
import { ChevronLeft } from '@mui/icons-material';

interface MoveTutorialProps {
    character: Character;
    onContinue: () => void;
}

const VideoBox = ({ src }: { src: string }) => (
    <Box
        sx={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            width: '100%',
        }}
    >
        <video
            src={src}
            autoPlay
            loop
            muted
            style={{
                top: 0,
                left: 0,
                position: 'absolute',
                maxWidth: '100%',
                height: 'auto',
            }}
        ></video>
    </Box>
);

const ComboTutorial = ({ combo }: { combo: ComboInfo }) => {
    const inputs = combo.actions
        .map((action) => action.display.name)
        .join(' - ');
    return (
        <>
            <VideoBox src={combo.video} />
            <Typography variant="h4">{combo.displayName}</Typography>
            <Typography>{combo.description}</Typography>
            Actions : {inputs}
            <Actions
                combo={combo.actions}
                isReadOnly={true}
                onChange={() => {}}
                handleActionDoubleClick={() => {}}
            />
        </>
    );
};

const MoveTutorial = ({ action }: { action: Action }) => (
    <>
        <VideoBox src={action.tutorial.video} />

        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                verticalAlign: 'middle',
            }}
        >
            <img
                src={action.display.icon}
                width="36px"
                style={{ margin: 'auto 0 auto 0' }}
            />
            <span
                style={{
                    marginLeft: '12px',
                    fontSize: '28px',
                    margin: 'auto 0 auto 6px',
                }}
            >
                {action.display.name}
            </span>
        </div>

        <Typography>{action.tutorial.description}</Typography>

        <Typography>Attack Duration : {action.frames.duration}</Typography>
    </>
);

const ActionReference = React.forwardRef<HTMLDivElement, MoveTutorialProps>(
    ({ character, onContinue }, ref) => {
        const moves = CHARACTERS_ACTIONS[
            character == Character.Jessica ? 0 : 1
        ].filter((action) => action.tutorial !== undefined);

        const comboInfos =
            character == Character.Jessica
                ? comboInfosJessica
                : comboInfosAntoc;

        const [selectedMove, changeSelectedMove] = useState<number>(0);

        const [selectedTab, changeSelectedTab] = useState<number>(0);

        const handleChangeTab = (event, newValue) => {
            changeSelectedMove(0);
            changeSelectedTab(newValue);
        };

        const selectedMoveAction = moves[selectedMove];
        const selectedCombo = comboInfos[selectedMove];

        return (
            <FullArtBackground useAlt gap={2} ref={ref}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '50%',
                    }}
                >
                    <Box>
                        <Typography
                            variant="h3"
                            color="text.primary"
                            gutterBottom
                        >
                            Action reference
                        </Typography>
                        <Typography
                            variant="poster"
                            color="text.primary"
                            gutterBottom
                        >
                            {character}
                        </Typography>
                    </Box>
                    <Box></Box>
                </Box>
                <Box
                    gap={2}
                    sx={{
                        display: 'flex',
                        alignItems: 'stretch',
                        width: '50%',
                        height: '60vh',
                    }}
                >
                    <Tile
                        sx={{
                            width: '30%',
                            overflowY: 'auto',
                        }}
                    >
                        <Tabs
                            value={selectedTab}
                            onChange={handleChangeTab}
                            centered
                        >
                            <Tab label="Normal" />
                            <Tab label="Combo" />
                        </Tabs>

                        <List component="nav" hidden={selectedTab != 0}>
                            {moves.map((move, index) => (
                                <ListItem
                                    disablePadding
                                    key={index}
                                    onClick={() => changeSelectedMove(index)}
                                >
                                    <ListItemButton
                                        selected={selectedMove === index}
                                    >
                                        <ListItemText
                                            // primary={`${move.display.unicode} ${move.display.name}`}
                                            primary={
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        verticalAlign: 'middle',
                                                    }}
                                                >
                                                    <img
                                                        src={move.display.icon}
                                                        width="24px"
                                                        style={{
                                                            margin: 'auto 0 auto 0',
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            marginLeft: '8px',
                                                            fontSize: '15px',
                                                        }}
                                                    >
                                                        {move.display.name}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        <List component="nav" hidden={selectedTab != 1}>
                            {comboInfos.map((combo, index) => (
                                <ListItem
                                    disablePadding
                                    key={index}
                                    onClick={() => changeSelectedMove(index)}
                                >
                                    <ListItemButton
                                        selected={selectedMove === index}
                                    >
                                        <ListItemText
                                            primary={` ${combo.displayName}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Tile>

                    <Tile
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'stretch',
                            width: 450,
                            overflowY: 'auto',
                        }}
                    >
                        <TileContent
                            sx={{
                                justifyContent: 'center',
                                alignItems: 'stretch',
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 2,
                                }}
                            >
                                {selectedTab == 0 ? (
                                    <MoveTutorial action={selectedMoveAction} />
                                ) : (
                                    <ComboTutorial combo={selectedCombo} />
                                )}
                            </Box>
                            <Box
                                display="flex"
                                flexDirection={'row'}
                                justifyContent={'flex-end'}
                            ></Box>
                        </TileContent>
                    </Tile>
                </Box>
                <ShoshinMenuButton size="large" onClick={onContinue}>
                    <ChevronLeft /> Back
                </ShoshinMenuButton>
            </FullArtBackground>
        );
    }
);

export default ActionReference;
