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
    const ANIM_FRAME_LATENCY = 300
    const INIT_PROGRAM = 'D,D,A,A'
    const MECH_INIT_X = 2
    const MECH_INIT_Y = 2
    const ATOM_INIT_XY = [{x:5, y:3}]
    const DIM = 8
    const UNIT_STATE_INIT = {
        bg_status: BgStatus.EMPTY,
        border_status: BorderStatus.EMPTY
    } as UnitState
    var unitStatesInit = []
    for (var i=0; i<DIM; i++){
        unitStatesInit.push(Array(DIM).fill(UNIT_STATE_INIT))
    }

    // React states
    const [program, setProgram] = useState(INIT_PROGRAM);
    const [instructions, setInstructions] = useState([]);
    const [animationState, setAnimationState] = useState ('Stop');
    const [animationFrame, setAnimationFrame] = useState<number> (0)
    const [mechInitPos, setMechInitPos] = useState<Grid> ({ x: MECH_INIT_X, y: MECH_INIT_Y })
    const [frames, setFrames] = useState<Frame[]>();
    const [loop, setLoop] = useState<NodeJS.Timer>();

    let mechInitStates = [
        { status: MechStatus.OPEN, index: mechInitPos, id: 'mech0', typ: 'singleton' }
    ] as MechState[]
    let atomInitStates = ATOM_INIT_XY.map(
        function (xy,i) {
            return {status:AtomStatus.FREE, index:{x:xy.x, y:xy.y}, id:`atom${i}`, typ:'vanilla', possessed_by:null} as AtomState
        }
    )

    const frame = frames?.[animationFrame]

    const atomStates = frame?.atoms || atomInitStates
    const mechStates = frame?.mechs || mechInitStates

    // Set mech visual
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

    // Set atom visual
    function setAtomVisualForStates (atom: AtomState, states: UnitState[][]){
        let newStates = JSON.parse(JSON.stringify(states)) // duplicate
        if (atom.status == AtomStatus.FREE){
            newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_VANILLA_FREE
        }
        else {
            newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_VANILLA_POSSESSED
        }
        return newStates
    }

    // Handle click event
    function handleClick (){
        // Run simulation
        if (animationState == 'Stop') {

            // Parse program into array of instructions and store to react state
            const instructions = program.split(',') as string[]
            if (instructions.length == 0) {return;}
            setInstructions (instructions)

            // Prepare input
            const boardConfig = {
                dimension: DIM as number,
                atom_faucets: [{id:'atom_faucet0', typ:'vanilla', index:{x:0,y:0}} as AtomFaucetState],
                atom_sinks: [{id:'atom_faucet0', typ:'vanilla', index:{x:DIM-1,y:DIM-1}} as AtomSinkState]
            } as BoardConfig

            // Run simulation to get all frames and set to reference
            const simulatedFrames = simulator (
                20, // n_cycles,
                mechInitStates,
                atomInitStates,
                instructions, // instructions
                boardConfig,
            )
            setFrames (simulatedFrames)

            simulatedFrames.forEach((f:Frame,i:number) => {
                const s = f.mechs.map(function(v){return JSON.stringify(v)}).join('\n')
                console.log(i, s)
            })
            console.log('delivered_accumulated at the last frame:', simulatedFrames[simulatedFrames.length-1].delivered_accumulated)

            // Begin animation
            setAnimationState ('Run')
            setLoop(
                setInterval(() => {
                    simulationLoop(simulatedFrames)
                }, ANIM_FRAME_LATENCY)
            );
            // console.log('Running with instruction:', instructions)
        }

        // Stop and reset simulation
        else {
            setAnimationState ('Stop')
            clearInterval (loop);
        }
    }

    function setMechInitX (x_str: string){

        if (!x_str) return;
        const x = parseInt(x_str)
        if (x < DIM && x >= 0) {
            setMechInitPos((prev) => ({ ...prev, x }))
        }
    }
    function setMechInitY (y_str: string){

        if (!y_str) return;
        const y = parseInt(y_str)
        if (y < DIM && y >= 0) {
            setMechInitPos((prev) => ({ ...prev, y }))
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

    let unitStates: UnitState[][]

    unitStates = setVisualForStates (atomStates, mechStates, unitStatesInit)

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

                <button onClick={handleClick}>{animationState == 'Stop' ? 'Run' : 'Stop'}</button>

                <p className={styles.description}>

                    <input
                        className={styles.program}
                        onChange={event => {setMechInitX(event.target.value)}}
                        defaultValue={MECH_INIT_X}
                        style={{width:'30px', textAlign:'center'}}
                        id={'input-mech-init-x'}
                    ></input>

                    <input
                        className={styles.program}
                        onChange={event => {setMechInitY(event.target.value)}}
                        defaultValue={MECH_INIT_Y}
                        style={{width:'30px', textAlign:'center'}}
                        id={'input-mech-init-y'}
                    ></input>

                    <input
                        className={styles.program}
                        onChange={event => {setProgram(event.target.value)}}
                        defaultValue={INIT_PROGRAM}
                        style={{width:'300px'}}
                    ></input>

                </p>

                <div className={styles.grid_parent}>
                    {
                        Array.from({length:DIM}).map ((_,i) => ( // i is y
                            <div key={`row-${i}`} className={styles.grid_row}>
                                {
                                    Array.from({length:DIM}).map ((_,j) => ( // j is x
                                        // <div id={`cell-${j}-${i}`} key={`cell-${j}-${i}`} className={styles.card}>
                                        //     ·
                                        // </div>
                                        <Unit key={`unit-${j}-${i}`} state={unitStates[j][i]}/>
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
