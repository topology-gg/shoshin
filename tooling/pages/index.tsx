import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState, useEffect, useRef, useCallback} from 'react';
import simulator from "./simulator"
import MechState, { MechStatus } from '../src/types/MechState';
import AtomState, { AtomStatus } from '../src/types/AtomState';
import AtomFaucetState from '../src/types/AtomFaucetState';
import AtomSinkState from '../src/types/AtomSinkState';
import BoardConfig from '../src/types/BoardConfig';
import Frame from '../src/types/Frame';
import Unit from './unit';
import UnitState, {BgStatus, BorderStatus} from '../src/types/UnitState';
import Grid from '../src/types/Grid';

export default function Home() {

    // Constants
    const N_CYCLES = 100
    const ANIM_FRAME_LATENCY = 300
    const INIT_PROGRAM = 'Z,S,S,D,D,X,W,W,A,A'
    const DIM = 3
    const MECH_INIT_X = 0
    const MECH_INIT_Y = 0
    const ATOM_INIT_XY = [] // [{x:5, y:3}]
    const UNIT_STATE_INIT = {
        bg_status: BgStatus.EMPTY,
        border_status: BorderStatus.EMPTY
    } as UnitState
    var unitStatesInit = []
    for (var i=0; i<DIM; i++){
        unitStatesInit.push(Array(DIM).fill(UNIT_STATE_INIT))
    }
    const FAUCET_X = 0
    const FAUCET_Y = 0
    const SINK_X = DIM-1
    const SINK_Y = DIM-1
    const MAX_NUM_MECHS = 3
    const MIN_NUM_MECHS = 1

    // React states
    const [programs, setPrograms] = useState<string[]>([INIT_PROGRAM]);
    const [instructionSets, setInstructionSets] = useState<string[][]>();
    const [animationState, setAnimationState] = useState ('Stop');
    const [animationFrame, setAnimationFrame] = useState<number> (0)
    const [mechInitPositions, setMechInitPositions] = useState<Grid[]> ([{ x: MECH_INIT_X, y: MECH_INIT_Y }])
    const [frames, setFrames] = useState<Frame[]>();
    const [loop, setLoop] = useState<NodeJS.Timer>();
    const [numMechs, setNumMechs] = useState(1)

    //
    // React state updates
    //

    const mechInitStates = mechInitPositions.map(
        (pos, mech_i) => { return {status: MechStatus.OPEN, index: pos, id: `mech${mech_i}`, typ: 'singleton'} }
    ) as MechState[]
    const atomInitStates = ATOM_INIT_XY.map(
        function (xy,i) { return {status:AtomStatus.FREE, index:{x:xy.x, y:xy.y}, id:`atom${i}`, typ:'vanilla', possessed_by:null} }
    ) as AtomState[]
    const frame = frames?.[animationFrame]
    const atomStates = frame?.atoms || atomInitStates
    const mechStates = frame?.mechs || mechInitStates
    const unitStates = setVisualForStates (atomStates, mechStates, unitStatesInit) as UnitState[][]

    //
    // Definition of setting DOM state
    //
    function setVisualForStates (atomStates: AtomState[], mechStates: MechState[], states: UnitState[][]){
        let newStates = JSON.parse(JSON.stringify(states)) // duplicate

        for (const atom of atomStates) {
            newStates = setAtomVisualForStates (atom, newStates)
        }
        for (const mech of mechStates) {
            newStates = setMechVisualForStates (mech, newStates)
        }

        return newStates
    }

    //
    // Definition of setting mech's visual to DOM state
    //
    function setMechVisualForStates (mech: MechState, states: UnitState[][]){
        let newStates = JSON.parse(JSON.stringify(states)) // duplicate
        if (mech.status == MechStatus.OPEN){
            newStates[mech.index.x][mech.index.y].border_status = BorderStatus.SINGLETON_OPEN
        }
        else {
            newStates[mech.index.x][mech.index.y].border_status = BorderStatus.SINGLETON_CLOSE
        }
        return newStates
    }

    //
    // Definition of setting atom's visual to DOM state
    //
    function setAtomVisualForStates (atom: AtomState, states: UnitState[][]){
        let newStates = JSON.parse(JSON.stringify(states)) // duplicate
        if (atom.status == AtomStatus.FREE){
            newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_VANILLA_FREE
        }
        else if (atom.status == AtomStatus.POSSESSED){
            newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_VANILLA_POSSESSED
        }
        return newStates
    }

    // Handle click event for adding/removing mechs
    function handleMechClick (mode: string){
        if (mode === '+' && numMechs < MAX_NUM_MECHS) {
            setNumMechs (prev => prev+1)
            setMechInitPositions(
                Array.from({length:numMechs+1}).fill({ x: MECH_INIT_X, y: MECH_INIT_Y }) as Grid[]
            )
            setPrograms(
                prev => {
                    let prev_copy = JSON.parse(JSON.stringify(prev))
                    prev_copy.push(INIT_PROGRAM);
                    return prev_copy
                }
            )
        }
        else if (mode === '-' && numMechs > MIN_NUM_MECHS) {
            setNumMechs (prev => prev-1)
            setMechInitPositions(
                Array.from({length:numMechs-1}).fill({ x: MECH_INIT_X, y: MECH_INIT_Y }) as Grid[]
            )
            setPrograms(
                prev => {
                    let prev_copy = JSON.parse(JSON.stringify(prev))
                    prev_copy.pop();
                    return prev_copy
                }
            )
        }
    }

    //
    // Handle click event for animation control
    //
    function handleClick (mode: string){
        // Run simulation
        if (mode == 'ToggleRun') {

            // Pause
            if (animationState == 'Run') {
                clearInterval (loop); // kill the timer
                setAnimationState ('Pause')
            }
            else {
                // Parse program into array of instructions and store to react state
                let instructionSets = []
                programs.forEach((program: string, mech_i:number) => {
                    const instructions = program.split(',') as string[]
                    instructionSets.push (instructions)
                })
                setInstructionSets (instructionSets)
                console.log('running instructionSets', instructionSets)

                // Prepare input
                const boardConfig = {
                    dimension: DIM as number,
                    atom_faucets: [{id:'atom_faucet0', typ:'vanilla', index:{x:FAUCET_X,y:FAUCET_Y}} as AtomFaucetState],
                    atom_sinks: [{id:'atom_faucet0', typ:'vanilla', index:{x:SINK_X,y:SINK_Y}} as AtomSinkState]
                } as BoardConfig

                // Run simulation to get all frames and set to reference
                const simulatedFrames = simulator (
                    N_CYCLES, // n_cycles,
                    mechInitStates,
                    atomInitStates,
                    instructionSets, // instructions
                    boardConfig,
                ) as Frame[]
                setFrames (simulatedFrames)

                simulatedFrames.forEach((f:Frame,i:number) => {
                    const s = f.mechs.map(function(v){return JSON.stringify(v)}).join('\n')
                    console.log(i, s)
                })
                const final_delivery = simulatedFrames[simulatedFrames.length-1].delivered_accumulated
                var n_vanilla = 0
                for (const delivered of final_delivery){
                    if (delivered == 'vanilla') {n_vanilla += 1}
                }
                console.log (`> delivered ${n_vanilla} vanilla atom(s)`)
                // console.log('delivered_accumulated at the last frame:', )

                // Begin animation
                setAnimationState ('Run')
                setLoop(
                    setInterval(() => {
                        simulationLoop(simulatedFrames)
                    }, ANIM_FRAME_LATENCY)
                );
                // console.log('Running with instruction:', instructions)
            }

        }
        else { // Stop
            clearInterval (loop); // kill the timer
            setAnimationState ('Stop')
            setAnimationFrame(() => {return 0})
        }

    }

    function setMechInitX (mech_i: number, x_str: string){

        if (!x_str) return;
        const x = parseInt(x_str)
        if (x < DIM && x >= 0) {
            // setMechInitPos((prev) => ({ ...prev, x }))
            setMechInitPositions(
                (prev) => {
                    let prev_copy = JSON.parse(JSON.stringify(prev))
                    prev_copy[mech_i] = { ...prev_copy[mech_i], x }
                    return prev_copy
                }
            )
        }
    }
    function setMechInitY (mech_i: number, y_str: string){

        if (!y_str) return;
        const y = parseInt(y_str)
        if (y < DIM && y >= 0) {
            // setMechInitPos((prev) => ({ ...prev, y }))
            setMechInitPositions(
                (prev) => {
                    let prev_copy = JSON.parse(JSON.stringify(prev))
                    prev_copy[mech_i] = { ...prev_copy[mech_i], y }
                    return prev_copy
                }
            )
        }
    }

    const simulationLoop = (frames) => {
        setAnimationFrame((prev) => {
            if (prev >= frames.length - 1) {
                return 0
            }
            else {
                return prev + 1
            }
        })
    }

    function computeUnitTyp (x:number, y:number){
        if (x == FAUCET_X && y == FAUCET_Y) return 'faucet'
        else if (x == SINK_X && y == SINK_Y) return 'sink'
        else return 'regular'
    }

    // Render
    return (
        <div className={styles.container}>
            <Head>
                <title>MovyMovy</title>
                <meta name="MovyMovy" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h2 className={styles.title}>
                    MovyMovy
                </h2>

                <div style={{display:'flex', flexDirection:'row', height:'20px', marginBottom:'10px'}}>
                    <button style={{fontSize:'0.75rem', marginRight:'3px'}} onClick={() => handleMechClick('+')}> {'+'} </button>
                    <button style={{fontSize:'0.75rem', marginRight:'3px'}} onClick={() => handleMechClick('-')}> {'-'} </button>
                    <button style={{fontSize:'0.75rem', marginRight:'3px'}} onClick={() => handleClick('ToggleRun')}> {animationState != 'Run' ? 'Run' : 'Pause'} </button>
                    <button style={{fontSize:'0.75rem', marginRight:'3px'}} onClick={() => handleClick('Stop')}> {'Stop'} </button>
                    <p style={{padding:'0', textAlign:'center', verticalAlign:'middle', margin:'0', height:'20px', lineHeight:'20px', fontSize:'0.75rem'}}>Frame# {animationFrame}</p>
                </div>

                <div className={styles.inputs}>

                    {
                        Array.from({length:numMechs}).map ((_,mech_i) => (
                            <div key={`input-row-${mech_i}`} className={styles.input_row}>
                                <p style={{margin:'0 10px 0 0', verticalAlign:'middle', height:'20px', lineHeight:'20px'}}>{`mech${mech_i}`}</p>
                                <input
                                    className={styles.program}
                                    onChange={event => {setMechInitX(mech_i, event.target.value)}}
                                    defaultValue={MECH_INIT_X}
                                    style={{width:'30px', textAlign:'center'}}
                                    id={'input-mech-init-x'}
                                ></input>

                                <input
                                    className={styles.program}
                                    onChange={event => {setMechInitY(mech_i, event.target.value)}}
                                    defaultValue={MECH_INIT_Y}
                                    style={{width:'30px', textAlign:'center'}}
                                    id={'input-mech-init-y'}
                                ></input>

                                <input
                                    className={styles.program}
                                    onChange={event => {setPrograms(
                                        (prev) => {
                                            let prev_copy = JSON.parse(JSON.stringify(prev))
                                            prev_copy[mech_i] = event.target.value
                                            return prev_copy
                                        }
                                    )}}
                                    defaultValue={INIT_PROGRAM}
                                    style={{width:'300px'}}
                                ></input>
                            </div>
                        ))
                    }

                </div>

                <div className={styles.grid_parent}>
                    {
                        Array.from({length:DIM}).map ((_,i) => ( // i is y
                            <div key={`row-${i}`} className={styles.grid_row}>
                                {
                                    Array.from({length:DIM}).map ((_,j) => ( // j is x
                                        <Unit
                                            key={`unit-${j}-${i}`}
                                            state={unitStates[j][i]}
                                            typ={computeUnitTyp(j,i)}
                                        />
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>
            </main>

        </div>
    )
}
