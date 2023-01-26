import { useState } from 'react'
import { Typography, Button } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useContext, useEffect } from "react";
import { INITIAL_DECISION_TREES, INITIAL_FUNCTIONS, INITIAL_MENTAL_STATES } from "../constants/constants";
import { WASMContext } from "../context/WASM";
import { buildAgent, flattenAgent } from "../types/Agent";
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
      flexDirection: 'column',
      alignItems: 'center',
    }}
    >
      {
          displayButton &&
          <button className={style}
          onClick={() => {
            let [combosOffset, combos, mentalStatesOffset, mentalStates, functionsOffset, functions] = flattenAgent(input)
            let [dummyCombosOffset, dummyCombos, dummyMentalStatesOffset, dummyMentalStates, dummyFunctionsOffset, dummyFunctions, dummyActions] = getDummyArgs(isDefensiveAdversary)
            let output
            try {
              let shoshinInput = ctx.wasm.fromArrays(
                combosOffset, 
                combos, 
                dummyCombosOffset, 
                dummyCombos, 
                mentalStatesOffset, 
                mentalStates,
                input.initialState,
                dummyMentalStatesOffset,
                dummyMentalStates,
                0,
                functionsOffset,
                functions, 
                dummyFunctionsOffset,
                dummyFunctions,
                input.actions,
                dummyActions,
                input.character,
                1
              )
              output = ctx.wasm.runCairoProgram(shoshinInput);
            } catch (e) {
              handleInputError(e)
              return
            }
            handleClickRunCairoSimulation(cairoOutputToFrameScene(output))
          }}
        >
          Run the Cairo Simulation
        </button> ||
        (!displayButton && <Typography variant="overline">Validate your agent to simulate it</Typography>)
      }
      { displayWarning && <Typography variant="overline" color="red">{warning}</Typography> }
      <Button
          id={`initial-actions-menu-button`}
          aria-controls={opened ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={opened ? 'true' : undefined}
          onClick={handleClick}
          sx={{
            marginTop: '1rem'
          }}
      >
          <Typography variant='overline'>{(isDefensiveAdversary? 'Defensive': 'Offensive') + ' adversary'}</Typography>
      </Button>
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
  let agent = buildAgent(INITIAL_MENTAL_STATES, [[1, 1, 1, 1, 1]], INITIAL_DECISION_TREES, INITIAL_FUNCTIONS, 0, 1)
  return [...flattenAgent(agent), new Int32Array([0, 101, 3, 4])]
}

const getDummyDefensiveArgs = () => {
  // TODO Update this to a more defensive agent
  let agent = buildAgent(INITIAL_MENTAL_STATES, [[1, 1, 1, 1, 1]], INITIAL_DECISION_TREES, INITIAL_FUNCTIONS, 0, 1)
  return [...flattenAgent(agent), new Int32Array([0, 101, 3, 4])]
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