import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Button } from "@mui/material";
import Agent from "../types/Agent";
import { MentalState } from "../types/MentalState";


export const FighterSelection = ({
  fighterSelection, setFighterSelection, agents, setMentalStates, setCombos, setTrees, setFunctions
}) => {
  const handleClose = (a: string) => {
    setFighterSelection(a)
  }

  const handleClickAgent = (i: number) => {
    // reconstruct mentalStates, Combos, Trees and Functions from the agent
    switch (fighterSelection) {
        case 'self': {
            let agent: Agent = agents[i]
            let ms: MentalState[] = agent?.actions.map((a, i) => {
                return {state: agent.states[i], action: a}
            })
            setMentalStates(ms)
            setCombos(agent?.combos)
            // TODO parse the agent's functions and mentalState in trees and functions
            // setTrees()
            // setFunctions()
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
        <ToggleButton value="adversary">Adversary</ToggleButton>
        <ToggleButton value="self">Self</ToggleButton>
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
                agents.map((_, i) => {
                    return <Button key={`agent-button-${i}`} variant="outlined" sx={{marginLeft: '0.5rem'}} onClick={() => handleClickAgent(i)}>Agent{i}</Button>
                })
            }
        </div>

    </div>
  );
};
