import React, { useEffect, useState } from 'react';
import { Box, Card, Grid, Tooltip, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DecisionTree from './DecisionTree';
import { Tree } from '../../types/Tree';
import { Condition, conditionToStr } from '../../types/Condition';
import { KeywordCondition, KeywordMentalState } from '../ui/Keyword';
import { Thought } from '../../types/MentalState';

const treeToString = (tree: Tree, conditions: Condition[]) => {
    let str = '';
    tree.nodes.forEach((n) => {
        if (n?.branch === 'left' && n.isChild) {
            str += n.id + `\n`;
        } else if (n?.branch === 'right' && n.isChild) {
            str += '_ => ' + n.id;
        } else {
            // Condition nodes
            const matchingCondition = conditions.find(
                (condition) => n.id == condition.key
            );
            str +=
                matchingCondition != undefined
                    ? matchingCondition.displayName
                    : n.id;
            str += ' => ';
        }
    });
    return str;
};

const treeToDecisionTree = (tree: Tree) => {
    let data = { nodes: [], edges: [] };
    let nodes = tree.nodes;
    let parents = tree.nodes.filter((n) => {
        return !n.isChild;
    });

    // make edges and nodes
    for (let i = 0; i < nodes.length - 1; i++) {
        data.edges.push({ data: { source: '', target: '' } });
    }

    nodes.forEach((n) => {
        data.nodes.push({
            data: { id: n.id },
            scratch: { child: n.isChild, branch: n?.branch },
        });
    });

    data.edges.map((e, i) => {
        e.data.source = parents[Math.floor(i / 2)].id;
    });

    let roots = nodes.slice(1);
    roots.forEach((n, i) => {
        let edge = data.edges[i];
        edge.data.target = n.id;
        data.edges[i] = edge;
    });
    return data;
};

const TreeEditor = ({
    isReadOnly,
    indexTree,
    tree,
    handleUpdateTree,
    mentalStates,
    conditions,
    handleClickTreeEditor,
    isWarningTextOn,
    warningText,
    newThoughtClicks,
}) => {
    let mentalState = mentalStates[indexTree];

    const [thoughts, setThoughts] = useState<Thought[]>([]);

    useEffect(() => {
        setThoughts((prev) =>
            prev.concat({
                conditionKey: 'conditionKey',
                nextState: 'nextState',
            })
        );
    }, [newThoughtClicks]);

    if (!tree) {
        // return to parent view
        handleClickTreeEditor(0);
        return;
    }

    const treeInString: string = treeToString(tree, conditions);

    return (
        <Box
            sx={{
                display: 'flex',
                flexGrow: 1,
                flexDirection: 'column',
                justifyContent: 'left',
                alignItems: 'flex-start',
                mt: '1rem',
            }}
        >
            <IconButton
                onClick={(_) => {
                    handleClickTreeEditor(0);
                }}
            >
                <ArrowBackIcon />
            </IconButton>
            <Box
                sx={{
                    mt: '1rem',
                    ml: '1rem',
                    minWidth: '50vw',
                }}
            >
                <p
                    style={{
                        margin: 0,
                        marginBottom: '24px',
                        fontSize: '16px',
                    }}
                >
                    Thoughts at <KeywordMentalState text={mentalState.state} />
                </p>

                {/* {
                    thoughts.map((thought, thought_i) => {return(
                        <div style={{display:'flex', flexDirection:'row', height:'30px', margin:'6px 0'}}>
                            <p style={{margin:'0', width:'20px', fontSize:'14px'}}>{thought_i+1}.</p>
                            <p style={{margin:'0'}}><KeywordCondition text={thought.conditionKey} /></p>
                            <p style={{margin:'0 4px', fontSize:'15px'}}>? go to / stay at</p>
                            <p style={{margin:'0'}}><KeywordMentalState text={mentalState.state} /></p>
                        </div>
                    )})
                } */}

                <TextField
                    color={'info'}
                    id="outlined-textarea"
                    placeholder={`C1 => MS IDLE,\nC2 => MS ATTACK,\n_ => MS DEFEND`}
                    defaultValue={treeInString}
                    label={`Which Mental State to Go Next?`}
                    onChange={(event) =>
                        handleUpdateTree(indexTree, event.target.value)
                    }
                    fullWidth
                    multiline
                    rows={5}
                    disabled={isReadOnly}
                    spellCheck={false}
                />

                <Box
                    sx={{
                        mt: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box>
                        <Box margin={'0.5rem'}>
                            {isWarningTextOn && (
                                <Typography
                                    color="red"
                                    padding={'0.1rem'}
                                    fontSize={'11px'}
                                    variant="overline"
                                >
                                    {warningText}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* left 50% showing available conditions, right 50% showing available mental states */}
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginLeft: '1rem',
                                    alignItems: 'left',
                                    mb: '1rem',
                                }}
                            >
                                <p
                                    style={{
                                        margin: '0 8px 0 0',
                                        padding: '0.1rem',
                                        fontSize: '16px',
                                    }}
                                >
                                    <span
                                        style={{
                                            marginRight: '8px',
                                            fontSize: '16px',
                                        }}
                                    >
                                        &#128208;
                                    </span>
                                    Available Conditions:
                                </p>

                                {conditions.length == 0 && (
                                    <Typography
                                        padding={'0.1rem'}
                                        fontSize={'12px'}
                                        color="red"
                                        variant="overline"
                                    >
                                        No Conditions available, go to
                                        Conditions tab to create some
                                    </Typography>
                                )}
                                {conditions
                                    .slice(0, conditions.length - 1)
                                    .map((condition, condition_i) => {
                                        return (
                                            // <Tooltip key={`tooltip-condition-${condition_i}`} title={`${condition.displayName}`}>
                                            <p style={{ marginBottom: '5px' }}>
                                                <KeywordCondition
                                                    text={condition.displayName}
                                                />
                                                {/* <span style={{width:'4px'}} /> */}
                                            </p>
                                            // </Tooltip>
                                        );
                                    })}
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginLeft: '0.5rem',
                                    alignItems: 'left',
                                }}
                            >
                                <p
                                    style={{
                                        margin: '0 8px 0 0',
                                        padding: '0.1rem',
                                        fontSize: '16px',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: '16px',
                                            marginRight: '8px',
                                        }}
                                    >
                                        &#129504;
                                    </span>
                                    Available Mental States:
                                </p>
                                {mentalStates.map((ms, i) => {
                                    return (
                                        <p style={{ marginBottom: '5px' }}>
                                            <KeywordMentalState
                                                text={ms.state}
                                            />
                                            {/* <span style={{width:'4px'}} /> */}
                                        </p>
                                    );
                                })}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            {/* <Box
            sx={{
                mt: '1rem',
                ml: '1rem',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                minWidth: '30vw',
            }}>
                <DecisionTree data={treeToDecisionTree(tree)} height={300} width={593}></DecisionTree>
            </Box> */}
        </Box>
    );
};

export default TreeEditor;
