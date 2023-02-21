import { useState } from 'react'
import { Typography, Button } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useContext, useEffect } from "react";
import { DEFENSIVE_AGENT, OFFENSIVE_AGENT } from "../constants/constants";
import { WASMContext } from "../context/WASM";
import { flattenAgent } from "../types/Agent";
import { FrameScene } from "../types/Frame";

export const CairoSimulation = ({
  style, handleClickRunCairoSimulation, warning, handleInputError, input, isDefensiveAdversary, setIsDefensiveAdversary
}) => {
  const ctx = useContext(WASMContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const opened = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
}
const handleClose = (isDefensive) => {
    setIsDefensiveAdversary(isDefensive)
    setAnchorEl(null)
}

  useEffect(() => {
    // Initialize wasm env.
    if (ctx.wasm) {
    }
    // ctx.wasm.start();
  }, [ctx]);

  if (!ctx.wasm) {
    return <>...</>;
  }

  let displayWarning = warning !== ''
  let displayButton = JSON.stringify(input) !== '{}'

  return (
    <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '1.5rem',
        }}
    >

        <Button
            id={`initial-actions-menu-button`}
            variant="outlined"
            aria-controls={opened ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={opened ? 'true' : undefined}
            onClick={handleClick}
        >
            {/* <Typography variant='overline'>{(isDefensiveAdversary? 'Defensive': 'Offensive') + ' adversary'}</Typography> */}
            {(isDefensiveAdversary? 'Defensive': 'Offensive') + ' adversary'}
        </Button>

        <Button
            id={`run-cairo-simulation`}
            variant="outlined"
            disabled={!displayButton}
            onClick={() => {
                let [combosOffset, combos, mentalStatesOffset, mentalStates, functionsOffset, functions] = flattenAgent(input)
                let [dummyCombosOffset, dummyCombos, dummyMentalStatesOffset, dummyMentalStates, dummyFunctionsOffset, dummyFunctions, dummyActions] = getDummyArgs(isDefensiveAdversary)
                try {
                    let shoshinInput = new Int32Array([
                        combosOffset.length,
                        ...combosOffset,
                        combos.length,
                        ...combos,
                        dummyCombosOffset.length,
                        ...dummyCombosOffset,
                        dummyCombos.length,
                        ...dummyCombos,
                        mentalStatesOffset.length,
                        ...mentalStatesOffset,
                        mentalStates.length/3,
                        ...mentalStates,
                        input.initialState,
                        dummyMentalStatesOffset.length,
                        ...dummyMentalStatesOffset,
                        dummyMentalStates.length/3,
                        ...dummyMentalStates,
                        0,
                        functionsOffset.length,
                        ...functionsOffset,
                        functions.length/3,
                        ...functions,
                        dummyFunctionsOffset.length,
                        ...dummyFunctionsOffset,
                        dummyFunctions.length/3,
                        ...dummyFunctions,
                        input.actions.length,
                        ...input.actions,
                        dummyActions.length,
                        ...dummyActions,
                        input.character,
                        1
                    ])
                    let output = ctx.wasm.runCairoProgram(shoshinInput);
                    handleClickRunCairoSimulation(cairoOutputToFrameScene(output))
                } catch (e) {
                    console.log('Got an error running wasm', e)
                    handleInputError(e)
                }
            }}
            sx={{
                marginLeft: '1rem'
            }}
        >
            Fight
        </Button>

      { displayWarning && <Typography variant="overline" color="red">{warning}</Typography> }

      {/* <Button id='constant' variant="outlined" onClick={handleAddElement}>Add</Button> */}

      <Menu
      id={'initial-actions-menu'}
      anchorEl={anchorEl}
      open={opened}
      onClose={handleClose}
      >
        <MenuItem key={ `defensive-adversary` } onClick={() => handleClose(true)}>Defensive adversary</MenuItem>
        <MenuItem key={ `offensive-adversary` } onClick={() => handleClose(false)}>Offensive adversary</MenuItem>
      </Menu>

</div>
);
};

const getDummyOffensiveArgs = () => {
  let agent = OFFENSIVE_AGENT;
  return [...flattenAgent(agent), new Int32Array(agent.actions)]
}

const getDummyDefensiveArgs = () => {
  let agent = DEFENSIVE_AGENT;
  return [...flattenAgent(agent), new Int32Array(agent.actions)]
}

const getDummyArgs = (defensive) => {
  return defensive? getDummyDefensiveArgs(): getDummyOffensiveArgs()
}

const cairoOutputToFrameScene = (output: any[]): FrameScene => {
  let scene: FrameScene = { agent_0: [], agent_1: [] }
  output.forEach((f) => {
      scene.agent_0.push({
        action: f.agent_0.action[0] ? f.agent_0.action[0] * f.agent_0.action[1][0]: 0,
        body_state: {
          counter: f.agent_0.body_state.counter[0]? f.agent_0.body_state.counter[0] * f.agent_0.body_state.counter[1][0]: 0,
          dir: f.agent_0.body_state.dir[0]? f.agent_0.body_state.dir[0] * f.agent_0.body_state.dir[1][0]: 0,
          integrity: f.agent_0.body_state.integrity[0]? f.agent_0.body_state.integrity[0] * f.agent_0.body_state.integrity[1][0]: 0,
          stamina: f.agent_0.body_state.stamina[0]? f.agent_0.body_state.stamina[0] * f.agent_0.body_state.stamina[1][0]: 0,
          state: f.agent_0.body_state.state[0]? f.agent_0.body_state.state[0] * f.agent_0.body_state.state[1][0]: 0,
          fatigued: f.agent_0.body_state.fatigued[0]? f.agent_0.body_state.fatigued[0] * f.agent_0.body_state.fatigued[1][0]: 0,
        },
        hitboxes: {
          action: {
            origin: {
              x: f.agent_0.hitboxes.action.origin.x[0]? f.agent_0.hitboxes.action.origin.x[0] * f.agent_0.hitboxes.action.origin.x[1][0]: 0,
              y: f.agent_0.hitboxes.action.origin.y[0]? f.agent_0.hitboxes.action.origin.y[0] * f.agent_0.hitboxes.action.origin.y[1][0]: 0,
            },
            dimension: {
              x: f.agent_0.hitboxes.action.dimension.x[0]? f.agent_0.hitboxes.action.dimension.x[0] * f.agent_0.hitboxes.action.dimension.x[1][0]: 0,
              y: f.agent_0.hitboxes.action.dimension.y[0]? f.agent_0.hitboxes.action.dimension.y[0] * f.agent_0.hitboxes.action.dimension.y[1][0]: 0,
            }
          },
          body: {
            origin: {
              x: f.agent_0.hitboxes.body.origin.x[0]? f.agent_0.hitboxes.body.origin.x[0] * f.agent_0.hitboxes.body.origin.x[1][0]: 0,
              y: f.agent_0.hitboxes.body.origin.y[0]? f.agent_0.hitboxes.body.origin.y[0] * f.agent_0.hitboxes.body.origin.y[1][0]: 0,
            },
            dimension: {
              x: f.agent_0.hitboxes.body.dimension.x[0]? f.agent_0.hitboxes.body.dimension.x[0] * f.agent_0.hitboxes.body.dimension.x[1][0]: 0,
              y: f.agent_0.hitboxes.body.dimension.y[0]? f.agent_0.hitboxes.body.dimension.y[0] * f.agent_0.hitboxes.body.dimension.y[1][0]: 0,
            }
          }
        },
        physics_state: {
          pos: {
            x: f.agent_0.physics_state.pos.x[0]? f.agent_0.physics_state.pos.x[0] * f.agent_0.physics_state.pos.x[1][0]: 0,
            y: f.agent_0.physics_state.pos.y[0]? f.agent_0.physics_state.pos.y[0] * f.agent_0.physics_state.pos.y[1][0]: 0,
          },
          vel_fp: {
            x: f.agent_0.physics_state.vel_fp.x[0]? f.agent_0.physics_state.vel_fp.x[0] * f.agent_0.physics_state.vel_fp.x[1][0]: 0,
            y: f.agent_0.physics_state.vel_fp.y[0]? f.agent_0.physics_state.vel_fp.y[0] * f.agent_0.physics_state.vel_fp.y[1][0]: 0,
          },
          acc_fp: {
            x: f.agent_0.physics_state.acc_fp.x[0]? f.agent_0.physics_state.acc_fp.x[0] * f.agent_0.physics_state.acc_fp.x[1][0]: 0,
            y: f.agent_0.physics_state.acc_fp.y[0]? f.agent_0.physics_state.acc_fp.y[0] * f.agent_0.physics_state.acc_fp.y[1][0]: 0,
          }
        },
        mental_state: f.agent_0.mental_state[0]? f.agent_0.mental_state[0] * f.agent_0.mental_state[1][0]: 0,
        stimulus: f.agent_0.stimulus[0]? f.agent_0.stimulus[0] * f.agent_0.stimulus[1][0]: 0,
      })
      scene.agent_1.push({
        action: f.agent_1.action[0] ? f.agent_1.action[0] * f.agent_1.action[1][0]: 0,
        body_state: {
          counter: f.agent_1.body_state.counter[0]? f.agent_1.body_state.counter[0] * f.agent_1.body_state.counter[1][0]: 0,
          dir: f.agent_1.body_state.dir[0]? f.agent_1.body_state.dir[0] * f.agent_1.body_state.dir[1][0]: 0,
          integrity: f.agent_1.body_state.integrity[0]? f.agent_1.body_state.integrity[0] * f.agent_1.body_state.integrity[1][0]: 0,
          stamina: f.agent_1.body_state.stamina[0]? f.agent_1.body_state.stamina[0] * f.agent_1.body_state.stamina[1][0]: 0,
          state: f.agent_1.body_state.state[0]? f.agent_1.body_state.state[0] * f.agent_1.body_state.state[1][0]: 0,
          fatigued: f.agent_1.body_state.fatigued[0]? f.agent_1.body_state.fatigued[0] * f.agent_1.body_state.fatigued[1][0]: 0,
        },
        hitboxes: {
          action: {
            origin: {
              x: f.agent_1.hitboxes.action.origin.x[0]? f.agent_1.hitboxes.action.origin.x[0] * f.agent_1.hitboxes.action.origin.x[1][0]: 0,
              y: f.agent_1.hitboxes.action.origin.y[0]? f.agent_1.hitboxes.action.origin.y[0] * f.agent_1.hitboxes.action.origin.y[1][0]: 0,
            },
            dimension: {
              x: f.agent_1.hitboxes.action.dimension.x[0]? f.agent_1.hitboxes.action.dimension.x[0] * f.agent_1.hitboxes.action.dimension.x[1][0]: 0,
              y: f.agent_1.hitboxes.action.dimension.y[0]? f.agent_1.hitboxes.action.dimension.y[0] * f.agent_1.hitboxes.action.dimension.y[1][0]: 0,
            }
          },
          body: {
            origin: {
              x: f.agent_1.hitboxes.body.origin.x[0]? f.agent_1.hitboxes.body.origin.x[0] * f.agent_1.hitboxes.body.origin.x[1][0]: 0,
              y: f.agent_1.hitboxes.body.origin.y[0]? f.agent_1.hitboxes.body.origin.y[0] * f.agent_1.hitboxes.body.origin.y[1][0]: 0,
            },
            dimension: {
              x: f.agent_1.hitboxes.body.dimension.x[0]? f.agent_1.hitboxes.body.dimension.x[0] * f.agent_1.hitboxes.body.dimension.x[1][0]: 0,
              y: f.agent_1.hitboxes.body.dimension.y[0]? f.agent_1.hitboxes.body.dimension.y[0] * f.agent_1.hitboxes.body.dimension.y[1][0]: 0,
            }
          }
        },
        physics_state: {
          pos: {
            x: f.agent_1.physics_state.pos.x[0]? f.agent_1.physics_state.pos.x[0] * f.agent_1.physics_state.pos.x[1][0]: 0,
            y: f.agent_1.physics_state.pos.y[0]? f.agent_1.physics_state.pos.y[0] * f.agent_1.physics_state.pos.y[1][0]: 0,
          },
          vel_fp: {
            x: f.agent_1.physics_state.vel_fp.x[0]? f.agent_1.physics_state.vel_fp.x[0] * f.agent_1.physics_state.vel_fp.x[1][0]: 0,
            y: f.agent_1.physics_state.vel_fp.y[0]? f.agent_1.physics_state.vel_fp.y[0] * f.agent_1.physics_state.vel_fp.y[1][0]: 0,
          },
          acc_fp: {
            x: f.agent_1.physics_state.acc_fp.x[0]? f.agent_1.physics_state.acc_fp.x[0] * f.agent_1.physics_state.acc_fp.x[1][0]: 0,
            y: f.agent_1.physics_state.acc_fp.y[0]? f.agent_1.physics_state.acc_fp.y[0] * f.agent_1.physics_state.acc_fp.y[1][0]: 0,
          }
        },
        mental_state: f.agent_1.mental_state[0]? f.agent_1.mental_state[0] * f.agent_1.mental_state[1][0]: 0,
        stimulus: f.agent_1.stimulus[0]? f.agent_1.stimulus[0] * f.agent_1.stimulus[1][0]: 0,
      })
  })
  return scene
}