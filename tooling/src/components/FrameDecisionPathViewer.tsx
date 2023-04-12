import { Person } from "@mui/icons-material";
import {
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { bodyStateNumberToName } from "../constants/constants";
import { Frame, TestJson, getFlattenedPerceptiblesFromFrame } from "../types/Frame";
import useEvaluateCondition from "../hooks/useEvaluateCondition";
import Agent from "../types/Agent";
import Leaf from "../types/Leaf";

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
    // A2: both p1 and p2 are of type Agent, which has the field mentalStatesNames: string[]. Added a helper function getMentalStatesNames()
    //     to get the mental states names of an agent.
    // Q3: among the input args of handleEvaluateCondition(), what is `memory`? Is it required for the purpose of this component?
    // A3: I added memory because I thought it might be useful for the evaluation of conditions but should actually be removed.

    const { runEvaluateCondition } = useEvaluateCondition();
    function handleEvaluateCondition(condition: Leaf, selfAgentFrame: Frame, opponentAgentFrame: Frame) {
        let perceptiblesSelf = getFlattenedPerceptiblesFromFrame(selfAgentFrame)
        let perceptiblesOpponent = getFlattenedPerceptiblesFromFrame(opponentAgentFrame)
        let perceptibles = perceptiblesSelf.concat(perceptiblesOpponent)

        let result = runEvaluateCondition(condition, perceptibles)
        return result
    }

    const characterLeftType = testJson?.agent_0.type
    const characterRightType = testJson?.agent_1.type
    const frameLeft = testJson?.agent_0.frames[animationFrame]
    const frameRight= testJson?.agent_1.frames[animationFrame]
    if (!frameLeft || !frameRight) return;

    const frames = [frameLeft, frameRight];
    const characterNames = [
        characterLeftType === 0 ? "jessica" : "antoc",
        characterRightType === 0 ? "jessica" : "antoc",
    ];

    return (
        <div style={{padding:'10px', paddingBottom:'20px', border:'1px solid #777', borderRadius:'20px'}}>
        <Grid container spacing={1}>
            {[frameLeft, frameRight].map((frame, i) => (
                <Grid item xs={6}>
                    <p>haha</p>
                </Grid>
            ))}
        </Grid>
        </div>
    );
};

export default FrameDecisionPathViewer;
