import React, { useMemo, useState } from "react";
import {
    Box,
    Button,
    Grid,
    ListItemText,
    MenuItem,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import Menu from "@mui/material/Menu";
import { MentalState } from "../../types/MentalState";
import { Character, CHARACTERS_ACTIONS } from "../../constants/constants";
import { getMentalStatesNames } from "../../types/Tree";
import MentalStatesGraph from "./MentalStatesGraph";

let currentMenu = 0;

const actionToStr = (action: number, characterIndex) => {
    if (action < 100) {
        return CHARACTERS_ACTIONS[characterIndex][action]?.replace("_", " ");
    }
    return `Combo ${action - 101}`;
};

const MentalStates = ({
    isReadOnly,
    mentalStates,
    trees,
    initialMentalState,
    combos,
    character,
    handleSetInitialMentalState,
    handleAddMentalState,
    handleClickRemoveMentalState,
    handleSetMentalStateAction,
    handleClickTreeEditor,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorElInitialState, setAnchorElInitialState] =
        useState<null | HTMLElement>(null);
    const [mentalState, setMentalState] = useState<string>(null);

    const open = Boolean(anchorEl);
    const openInitialState = Boolean(anchorElInitialState);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        let id = event.currentTarget.id.split("-");
        let menuIndex = parseInt(id[id.length - 1]);
        currentMenu = menuIndex;
        setAnchorEl(event.currentTarget);
    };
    const handleChosenActionForMentalState = (action) => {
        if (action) {
            if (!action.includes("Combo")) {
                handleSetMentalStateAction(
                    currentMenu,
                    CHARACTERS_ACTIONS[characterIndex][action]
                );
            } else {
                let comboNumber = parseInt(action.split(" ")[1]);
                handleSetMentalStateAction(currentMenu, 101 + comboNumber);
            }
        }
        setAnchorEl(null);
    };
    const handleClickInitialState = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorElInitialState(event.currentTarget);
    };
    const handleChosenInitialState = (mentalStateIndex) => {
        if (typeof mentalStateIndex == "number") {
            handleSetInitialMentalState(mentalStateIndex);
        }
        setAnchorElInitialState(null);
    };

    let characterIndex = Object.keys(Character).indexOf(character);
    let actions = Object.keys(CHARACTERS_ACTIONS[characterIndex]).filter((a) =>
        isNaN(parseInt(a))
    );
    combos.forEach((_, i) => {
        actions.push(`Combo ${i}`);
    });

    // handle mental graph visualization
    const mentalStateNamesOrdered = useMemo(
        () =>
            mentalStates.map((ms, _) => {
                return ms.state;
            }),
        [mentalStates]
    );
    const nextMentalStateNamesOrdered: string[][] = useMemo(
        () =>
            mentalStates.map((_, ms_i: number) =>
                getMentalStatesNames(trees[ms_i])
            ),
        [mentalStates]
    );

    const [highlightedMentalState, setHighlightedMentalState] =
        useState<number>(-1);

    const highlightMentalState = (index: number) => {
        setHighlightedMentalState(index);
    };

    const selectMentalState = (index: number) => {
        handleClickTreeEditor(index + 1);
    };

    let componentAddNewMentalState = (
        <>
            <Grid
                xs={1}
                item
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                }}
            >
                <IconButton
                    onClick={(_) => {
                        mentalState ? handleAddMentalState(mentalState) : 0;
                    }}
                    disabled={isReadOnly}
                >
                    <AddIcon />
                </IconButton>
            </Grid>
            <Grid xs={10} item>
                <TextField
                    color={"info"}
                    fullWidth
                    id="standard-basic"
                    label="Name of the new mental state"
                    variant="standard"
                    onChange={(event) => setMentalState(event.target.value)}
                    disabled={isReadOnly}
                />
            </Grid>
        </>
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "left",
                alignItems: "left",
                pt: "1rem",
                pl: "2rem",
            }}
        >
            <Typography sx={{ fontSize: "17px" }} variant="overline">
                <span style={{ marginRight: "8px" }}>&#129504;</span>Mind
            </Typography>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                {isReadOnly ? <></> : componentAddNewMentalState}
            </div>

            <Grid container>
                <Grid item xs={6}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "left",
                            alignItems: "left",
                            mt: "1rem",
                            pl: "2rem",
                            pr: "2rem",
                        }}
                    >
                        <Button
                            id={`initial-actions-menu-button`}
                            aria-controls={
                                openInitialState ? "basic-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={
                                openInitialState ? "true" : undefined
                            }
                            onClick={handleClickInitialState}
                            disabled={isReadOnly}
                        >
                            <Typography variant="overline">
                                Starting state:{" "}
                                {mentalStates.length > 0
                                    ? mentalStates[initialMentalState].state
                                    : "Create at least one mental state"}
                            </Typography>
                        </Button>
                        <Menu
                            id={"initial-actions-menu"}
                            anchorEl={anchorElInitialState}
                            open={openInitialState}
                            onClose={(e) => handleChosenInitialState(null)}
                        >
                            {mentalStates.map(
                                (mentalState, mentalStateIndex) => {
                                    return (
                                        <MenuItem>
                                            <ListItemText
                                                onClick={(e) =>
                                                    handleChosenInitialState(
                                                        mentalStateIndex
                                                    )
                                                }
                                            >
                                                {mentalState.state}
                                            </ListItemText>
                                        </MenuItem>
                                    );
                                }
                            )}
                        </Menu>
                    </Box>

                    {mentalStates.map((state: MentalState, i: number) => {
                        return (
                            <Box
                                key={`button-wrapper-${i}`}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    ml: "2rem",
                                    bgcolor:
                                        highlightedMentalState == i
                                            ? "lightgrey"
                                            : null,
                                }}
                            >
                                <button
                                    className={"mentalStateButton"}
                                    key={`${i}`}
                                    onClick={() => handleClickTreeEditor(i + 1)}
                                >
                                    {state.state}
                                </button>

                                <IconButton
                                    onClick={(_) =>
                                        handleClickRemoveMentalState(i)
                                    }
                                    disabled={isReadOnly}
                                >
                                    <DeleteIcon sx={{ fontSize: "small" }} />
                                </IconButton>

                                <Button
                                    id={`actions-button-${i}`}
                                    aria-controls={
                                        open ? "basic-menu" : undefined
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={handleClick}
                                    disabled={isReadOnly}
                                >
                                    <span style={{ marginRight: "7px" }}>
                                        &#129354;
                                    </span>{" "}
                                    {actionToStr(state.action, characterIndex)}
                                </Button>

                                <Menu
                                    id={`actions-menu-${i}`}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={(e) =>
                                        handleChosenActionForMentalState(null)
                                    }
                                >
                                    {actions.map((action) => {
                                        return (
                                            <MenuItem>
                                                <ListItemText
                                                    onClick={(e) =>
                                                        handleChosenActionForMentalState(
                                                            action
                                                        )
                                                    }
                                                >
                                                    {action.replaceAll(
                                                        "_",
                                                        " "
                                                    )}
                                                </ListItemText>
                                            </MenuItem>
                                        );
                                    })}
                                </Menu>
                            </Box>
                        );
                    })}
                </Grid>

                <Grid item xs={6}>
                    <MentalStatesGraph
                        mentalStateNamesOrdered={mentalStateNamesOrdered}
                        nextMentalStateNamesOrdered={
                            nextMentalStateNamesOrdered
                        }
                        highlightMentalState={highlightMentalState}
                        selectMentalState={selectMentalState}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default MentalStates;
