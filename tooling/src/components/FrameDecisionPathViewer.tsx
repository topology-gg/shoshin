import { Person } from '@mui/icons-material';
import {
    Button,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box } from '@mui/system';
import React, { useMemo, useState } from 'react';
import { bodyStateNumberToName } from '../constants/constants';
import {
    Frame,
    TestJson,
    getFlattenedPerceptiblesFromFrame,
} from '../types/Frame';
import useEvaluateCondition from '../hooks/useEvaluateCondition';
import Agent, { getMentalTree } from '../types/Agent';
import Leaf from '../types/Leaf';
import { Tree, getConditionsIndex, getMentalStatesNames } from '../types/Tree';
import { Condition } from '../types/Condition';
import { KeywordMentalState } from './ui/Keyword';

type FrameDecisionPathViewerProps = {
    p1: Agent;
    p2: Agent;
    testJson: TestJson;
    animationFrame: number;
};

const FrameDecisionPathViewer = ({
    p1,
    p2,
    testJson,
    animationFrame,
}: FrameDecisionPathViewerProps) => {
    // This component takes p1 (Agent), p2 (Agent), the simulation result (Frame[] for p1 and p2) and the current frame number in animation,
    // and displays the decision path.
    //
    // For example, if at current frame, p1's decision tree looks like "C1 => S1; C2 => S2; _ => S3",
    // the following three lines of text would be displayed:
    // ```
    //   C1 (false) => S1
    //   C2 (true) => S2
    //   _ => S3
    // ```
    // where S2 should be highlighted because it is the chosen next mental state

    // With the example above, I have the following questions:
    // Q1: given an Agent (p1 or p2), how to get an array containing all the conditions involved, in order? i.e. [C1, C2]
    //     (because with this array obtained, we can evaluate each condition in the array using handleEvaluateCondition() right?)
    // A1: updated the signature of handleEvaluateCondition() to take condition: Leaf. p1 and p2 are both of type Agent, which
    //     has the field conditions: Leaf[]. Conditions contains all the conditions of the agent in order.
    // Q2: given an Agent (p1 or p2), how to get an array containing all the mental state names involved, in order i.e. [S1, S2, S3]
    // A2: this can now be accessed in the variables mentalStatesNamesPerTree Left and Right for agent p1 and p2. The data is
    //     is stored in the form of string[][] where the first index is the tree index and the second index is the mental state index.
    // Q3: among the input args of handleEvaluateCondition(), what is `memory`? Is it required for the purpose of this component?
    // A3: I added memory because I thought it might be useful for the evaluation of conditions but should actually be removed.

    const [
        animationFrameAtLastConditionEvalPerPlayer,
        setAnimationFrameAtLastConditionEvalPerPlayer,
    ] = useState<number[]>([-1, -1]);

    const { runEvaluateCondition } = useEvaluateCondition();
    function handleEvaluateCondition(
        condition: Leaf,
        selfAgentFrame: Frame,
        opponentAgentFrame: Frame
    ) {
        let perceptiblesSelf =
            getFlattenedPerceptiblesFromFrame(selfAgentFrame);
        let perceptiblesOpponent =
            getFlattenedPerceptiblesFromFrame(opponentAgentFrame);
        let perceptibles = perceptiblesSelf.concat(perceptiblesOpponent);

        let result = runEvaluateCondition(condition, perceptibles);
        return result;
    }

    const characterLeftType = testJson?.agent_0.type;
    const characterRightType = testJson?.agent_1.type;
    const frameLeft = testJson?.agent_0.frames[animationFrame];
    const frameRight = testJson?.agent_1.frames[animationFrame];
    if (!frameLeft || !frameRight) return;

    const frames = [frameLeft, frameRight];
    const characterNames = [
        characterLeftType === 0 ? 'jessica' : 'antoc',
        characterRightType === 0 ? 'jessica' : 'antoc',
    ];

    const currentTreeIndexLeft = frameLeft.mental_state;
    const currentTreeIndexRight = frameRight.mental_state;
    const mentalTreeLeft: Tree = getMentalTree(p1, currentTreeIndexLeft);
    const mentalTreeRight: Tree = getMentalTree(p2, currentTreeIndexRight);
    const mentalTrees: Tree[] = [mentalTreeLeft, mentalTreeRight];
    const players: Agent[] = [p1, p2];
    const agentMentalStateNames = [p1.mentalStatesNames, p2.mentalStatesNames];

    const getMentalStatesNamesForTree = (tree: Tree) => {
        let mentalStatesNames: string[] = getMentalStatesNames(tree);
        return mentalStatesNames;
    };

    const getConditionsIndexForTree = (
        tree: Tree,
        conditionNames: string[]
    ) => {
        let conditionsIndex: number[] = getConditionsIndex(
            tree,
            conditionNames
        );
        return conditionsIndex;
    };

    const getConditionEvaluationForAgent = (
        agent: Agent,
        conditionIndex: number,
        frameSelf: Frame,
        frameOpponent: Frame
    ) => {
        let condition = agent.conditions[conditionIndex];
        let conditionEvaluation = handleEvaluateCondition(
            condition,
            frameSelf,
            frameOpponent
        );

        if (conditionEvaluation[1] !== null) {
            console.log('error in evaluation', conditionEvaluation[1]);
            return -1;
        }

        return conditionEvaluation[0];
    };

    const canRenderDecisionPathForPlayerIndex = (
        playerIndex: number
    ): boolean => {
        if (
            animationFrame !=
            animationFrameAtLastConditionEvalPerPlayer[playerIndex]
        ) {
            return false;
        } else {
            return true;
        }
    };

    interface PatterMatchExpression {
        LHS: String;
        RHS: String;
    }
    const decisionPathDisplayRender = (playerIndex: number) => {
        // TODO: block this function with a react state settable by user button click

        if (canRenderDecisionPathForPlayerIndex(playerIndex) == false) {
            return <></>;
        }

        const mentalTree = mentalTrees[playerIndex];
        const player = players[playerIndex];
        console.log(mentalTree);
        const mentalStatesNames: string[] =
            getMentalStatesNamesForTree(mentalTree);
        const conditionsIndex: number[] = getConditionsIndexForTree(
            mentalTree,
            player.conditionNames
        );
        const conditionsEvaluations: number[] = conditionsIndex.map(
            (conditionIndex) => {
                return getConditionEvaluationForAgent(
                    player,
                    conditionIndex,
                    frameLeft,
                    frameRight
                );
            }
        );

        let content = [];
        mentalStatesNames.forEach((state, state_i) => {
            if (state_i == mentalStatesNames.length - 1) {
                content.push({ LHS: '_', RHS: state } as PatterMatchExpression);
            } else {
                content.push({
                    LHS: `${player.conditionNames[conditionsIndex[state_i]]} (${
                        conditionsEvaluations[state_i]
                    })`,
                    RHS: state,
                } as PatterMatchExpression);
                // content.push(`${player.conditionNames[conditionsIndex[state_i]]} (${conditionsEvaluations[state_i]}) => ${state}`)
            }
        });

        return (
            <Box sx={{ pl: '27px' }}>
                {content.map(
                    (patternMatchExpression: PatterMatchExpression) => (
                        <p>
                            {patternMatchExpression.LHS}
                            {' => '}
                            <KeywordMentalState
                                text={patternMatchExpression.RHS}
                            />
                        </p>
                    )
                )}
            </Box>
        );
    };

    return (
        // <div style={{padding:'10px', paddingBottom:'20px', paddingLeft:'24px', border:'1px solid #777', borderRadius:'20px'}}>
        <>
            <Grid container spacing={1}>
                {[0, 1].map((playerIndex) => (
                    <Grid item xs={6}>
                        <>
                            <span style={{ fontSize: '12px' }}>
                                P{playerIndex}
                            </span>
                            <IconButton disabled size="small">
                                <Person />
                            </IconButton>
                        </>

                        <p style={{ marginBottom: '24px' }}>
                            <span style={{ fontSize: '20px' }}>&#129504;</span>{' '}
                            Mental State:{' '}
                            <KeywordMentalState
                                text={
                                    agentMentalStateNames[playerIndex][
                                        frames[playerIndex].mental_state
                                    ]
                                }
                            />
                        </p>

                        {!canRenderDecisionPathForPlayerIndex(playerIndex) ? (
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                    setAnimationFrameAtLastConditionEvalPerPlayer(
                                        (prev) => {
                                            if (playerIndex == 0) {
                                                return [
                                                    animationFrame,
                                                    prev[1],
                                                ];
                                            } else {
                                                return [
                                                    prev[0],
                                                    animationFrame,
                                                ];
                                            }
                                        }
                                    );
                                }}
                            >
                                <RemoveRedEyeIcon sx={{ mr: '4px' }} />
                                <span>decision path</span>
                            </Button>
                        ) : (
                            <></>
                        )}
                        {decisionPathDisplayRender(playerIndex)}
                    </Grid>
                ))}
            </Grid>
            {/* </div> */}
        </>
    );
};

export default FrameDecisionPathViewer;
