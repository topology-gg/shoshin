import React from 'react';
import { Box, Card, Tooltip, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DecisionTree from './DecisionTree'
import { Tree } from '../../types/Tree'
import { conditionToStr } from '../../types/Condition'

const treeToString = (tree: Tree) => {
    let str = ''
    tree.nodes.forEach((n) => {
        if (n?.branch === 'left' && n.isChild) {
            str += n.id + `:\n`
        } else if (n?.branch === 'right' && n.isChild) {
            str += n.id
        } else {
            str += n.id + ' ? '
        }
    })
    return str
}

const treeToDecisionTree = (tree: Tree) => {
    let data = { nodes: [], edges: [] }
    let nodes = tree.nodes
    let parents = tree.nodes.filter((n) => {
        return !n.isChild
    })

    // make edges and nodes
    for (let i = 0; i < nodes.length - 1; i++){
        data.edges.push({ data: { source: '', target: '' } })
    }

    nodes.forEach((n) => {
        data.nodes.push({ data: { id: n.id }, scratch: { child: n.isChild, branch: n?.branch } })
    })

    data.edges.map((e, i) => {
        e.data.source = parents[Math.floor(i/2)].id
    })

    let roots = nodes.slice(1)
    roots.forEach((n, i) => {
        let edge = data.edges[i]
        edge.data.target = n.id
        data.edges[i] = edge
    })
    return data
}


const TreeEditor = ({
    isReadOnly, indexTree, tree, handleUpdateTree, mentalStates, conditions, handleClickTreeEditor,
    isWarningTextOn, warningText
}) => {
    let mentalState = mentalStates[indexTree]

    if (!tree) {
        // return to parent view
        handleClickTreeEditor(0);
        return;
    }

    return(
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
            <IconButton onClick={(_)=>{handleClickTreeEditor(0)}}><ArrowBackIcon/></IconButton>
            <Box
            sx={{
                mt: '1rem',
                ml: '1rem',
                minWidth:'30vw'
            }}>
                <TextField
                    color={'info'}
                    id='outlined-textarea'
                    placeholder={`if F1? MS IDLE:\nif F2? MS ATTACK:\nMS DEFEND`}
                    defaultValue={treeToString(tree)}
                    label={`Decision Tree for ${mentalState.state}`}
                    onChange={ (event) => handleUpdateTree(indexTree, event.target.value) }
                    fullWidth
                    multiline
                    rows={10}
                    disabled={isReadOnly}
                />
                <Box
                sx={{
                    mt: '1rem',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                >
                    <Box>
                        <Box margin={'0.5rem'}>{isWarningTextOn && <Typography color='red' padding={'0.1rem'} fontSize={'11px'} variant='overline'>{warningText}</Typography>}</Box>
                    </Box>
                    <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginLeft: '0.5rem',
                    }}
                    >
                        <Typography padding={'0.1rem'} fontSize={'11px'} variant='overline'>Available conditions:</Typography>
                        {(conditions.length == 0) && <Typography padding={'0.1rem'} fontSize={'11px'} color='red' variant='overline'>No conditions available, go to Conditions tab to create some</Typography>}
                        {
                            conditions.slice(0, conditions.length - 1).map((f, i) => {
                                return (
                                    <Tooltip key={`tooltip-condition-${i}`} title={`${conditionToStr(f)}`}>
                                        <Card
                                        sx={{
                                            margin: '0.2rem 0.2rem 0.3rem 0.2rem',
                                            padding: '0.1rem',
                                        }}
                                        key={`card-condition-${i}`}
                                        >F{i}</Card>
                                    </Tooltip>
                                )
                            })
                        }
                    </Box>
                    <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginLeft: '0.5rem',
                    }}
                    >
                        <Typography padding={'0.1rem'} fontSize={'11px'} variant='overline'>Available mental states:</Typography>
                        {
                            mentalStates.map((ms, i) => {
                                return (
                                    <Card
                                    sx={{
                                        margin: '0.2rem 0.2rem 0.3rem 0.2rem',
                                        padding: '0.1rem',
                                    }}
                                    key={`card-mental-state-${i}`}
                                    >{ms.state}</Card>
                                )
                            })
                        }
                    </Box>
                </Box>
            </Box>
            <Box
            sx={{
                mt: '1rem',
                ml: '1rem',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                minWidth: '30vw',
            }}>
                <DecisionTree data={treeToDecisionTree(tree)} height={300} width={593}></DecisionTree>
            </Box>
        </Box>
    )
}

export default TreeEditor;
