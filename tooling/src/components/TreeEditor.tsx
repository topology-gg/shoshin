import React from 'react';
import { Box, Card, Tooltip, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DecisionTree from './DecisionTree'
import { Tree } from '../types/Tree'
import { functionToStr } from '../types/Function'

const data = {
    nodes: [
        { data: { id: 'if F1' }, scratch: {child: false} },
        { data: { id: 'MS DEFEND' }, scratch: { child: true, branch: 'left' } },
        { data: { id: 'if F2' }, scratch: { child: false }},
        { data: { id: 'MS CHILL' }, scratch: { child: true, branch: 'left' }},
        { data: { id: 'if F3' }, scratch: { child: false } },
        { data: { id: 'MS CLOSER' }, scratch: { child: true, branch: 'right' } },
        { data: { id: 'MS AGGRO' }, scratch: { child: true, branch: 'left' } },
    ],
    edges: [
        { data: { source: 'if F1', target: 'MS DEFEND' } }, // F1 true
        { data: { source: 'if F1', target: 'if F2' } }, // F1 false
        { data: { source: 'if F2', target: 'MS CHILL' } }, // F2 true
        { data: { source: 'if F2', target: 'if F3' } }, // F2 false
        { data: { source: 'if F3', target: 'MS CLOSER' } }, // F3 true
        { data: { source: 'if F3', target: 'MS AGGRO' } }, // F3 false
    ]
  };

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


const TreeEditor = ({indexTree, tree, handleUpdateTree, mentalState, functions, handleClickTreeEditor}) => {
    return(
        <Box
        sx={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'left',
            alignItems: 'flex-start',
            mt: '1rem',
        }}>
            <IconButton onClick={(_)=>{handleClickTreeEditor(0)}}><CancelIcon/></IconButton>
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
                />
                <Box
                sx={{
                    mt: '1rem',
                    display: 'flex',
                    flexDirection: 'row'
                }}
                >
                    <Typography variant='overline'>Available functions:</Typography>
                    {
                        functions.slice(0, functions.length - 1).map((f, i) => {
                            return (
                                <Tooltip key={`tooltip-function-${i}`} title={`${functionToStr(f)}`}>
                                    <Card
                                    sx={{ 
                                        margin: '0.2rem',
                                        padding: '0.2rem',
                                    }}
                                    >F{i}</Card>
                                </Tooltip>
                            )
                        })
                    }
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
