import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Button } from "@mui/material";
import { Character } from "../constants/constants";
import Agent from "../types/Agent";
import { Function } from "../types/Function";
import { unwrapLeafToFunction, unwrapLeafToTree } from "../types/Leaf";
import { MentalState } from "../types/MentalState";
import { Direction, Tree } from "../types/Tree";


export const FighterSelection = ({
  fighterSelection, setFighterSelection, setOpponent, agents, setMentalStates, setCombos, setTrees, functions, setFunctions, setCharacter
}) => {
  const handleClose = (a: string) => {
    setFighterSelection(a)
  }
  const characters = Object.keys(Character)

  const handleClickAgent = (i: number) => {
    // reconstruct mentalStates, Combos, Trees and Functions from the agent
    switch (fighterSelection) {
        case 'self': {
            let agent: Agent = agents[i]
            // parse mental states
            let ms: MentalState[] = agent?.actions.map((a, i) => {
                return {state: agent.states[i], action: a}
            })
            setMentalStates(ms)
            // parse combos
            setCombos(agent?.combos)
            // parse functions
            let fs: Function[] = agent?.generalPurposeFunctions.map((gp) => {
                return {elements: unwrapLeafToFunction(gp)}
            })
            let len = functions.length
            setFunctions(functions.concat(fs))
            // parse trees
            let trees: Tree[] = agent?.mentalStates.map((ms) => {
                let t = unwrapLeafToTree(ms, len)
                // if t.length == 1, add the F9 function which always evaluates to true
                return {nodes: t.length == 1? [{id: 'if F9', isChild: false}, {id: t[0].id, isChild: true, branch: Direction.Left}, ...t]: t}
            })
            setTrees(trees)
            // set the character
            setCharacter(characters[agent.character])
            break
        }
        case 'opponent': {
          setOpponent(agents[i])
          break
        }
    }
  }

  return (
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '1.5rem',
        }}
    >
      <ToggleButtonGroup value={fighterSelection} exclusive onChange={(e, value) => handleClose(value)}>
        <ToggleButton value="opponent">Set Opponent</ToggleButton>
        <ToggleButton value="self">Set Self</ToggleButton>
      </ToggleButtonGroup>

        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1.5rem',
            }}
        >   
            {
                agents?.map((a: Agent, i:number) => {
                    return <Button key={`agent-button-${i}`} variant="outlined" sx={{marginLeft: '0.5rem'}} onClick={() => handleClickAgent(i)}>{characters[a.character]} Agent {i}</Button>
                })
            }
        </div>

    </div>
  );
};
