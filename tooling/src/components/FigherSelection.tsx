import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Button } from "@mui/material";


export const FighterSelection = ({
  fighterSelection, setFighterSelection, agents
}) => {
  const handleClose = (a: string) => {
    setFighterSelection(a)
  }

  const handleClickAgent = (i: number) => {
    console.log('Agent ', i)
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
