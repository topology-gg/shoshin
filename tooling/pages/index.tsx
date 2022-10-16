import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState, useEffect, useRef, useCallback} from 'react';
import simulator from "./simulator";
import MechState, { MechStatus } from '../src/types/MechState';
import AtomState, { AtomStatus, AtomType } from '../src/types/AtomState';
import AtomFaucetState from '../src/types/AtomFaucetState';
import AtomSinkState from '../src/types/AtomSinkState';
import BoardConfig from '../src/types/BoardConfig';
import Frame from '../src/types/Frame';
import Unit from './unit';
import UnitState, {BgStatus, BorderStatus, UnitText} from '../src/types/UnitState';
import Grid from '../src/types/Grid';
import BinaryOperator, {BinaryOperatorType} from '../src/types/BinaryOperator';
import Delivery from './delivery'

export default function Home() {

    // Constants
    const N_CYCLES = 100
    const ANIM_FRAME_LATENCY = 300
    const INIT_PROGRAM = 'Z,S,S,D,D,X,W,W,A,A'
    const DIM = 8
    const MECH_INIT_X = 0
    const MECH_INIT_Y = 0
    const ATOM_INIT_XY = [] // [{x:5, y:3}]
    const UNIT_STATE_INIT: UnitState = {
        bg_status: BgStatus.EMPTY,
        border_status: BorderStatus.EMPTY,
        unit_text: UnitText.GRID,
        unit_id: null,
    }
    var unitStatesInit = []
    for (var i=0; i<DIM; i++){
        unitStatesInit.push(Array(DIM).fill(UNIT_STATE_INIT))
    }
    const FAUCET_POS: Grid = {x:0, y:0}
    const SINK_POS: Grid = {x:DIM-1, y:DIM-1}
    const MAX_NUM_MECHS = 5
    const MIN_NUM_MECHS = 1
    const MAX_NUM_ADDERS = 5
    const MIN_NUM_ADDERS = 0

    // React states
    const [programs, setPrograms] = useState<string[]>([
        'Z,S,S,D,D,X,W,W,A,A',
        '_,_,_,_,_,_,Z,S,X,W',
        'Z,S,S,S,D,D,D,D,D,X,A,A,A,A,A,W,W,W'
    ]);
    const [instructionSets, setInstructionSets] = useState<string[][]>();
    const [numMechs, setNumMechs] = useState(3)
    const [mechInitPositions, setMechInitPositions] = useState<Grid[]> ([
        { x:0, y:0 },
        { x:2, y:2 },
        { x:2, y:4 }
    ])
    const [numAdders, setNumAdders] = useState(1)
    const [adderStates, setAdderStates] = useState<BinaryOperator[]> ([
        { a:{x:2,y:2}, b:{x:2,y:3}, z:{x:2,y:4}, typ:BinaryOperatorType.ADDER }
    ])
    const [animationState, setAnimationState] = useState ('Stop');
    const [animationFrame, setAnimationFrame] = useState<number> (0)
    const [frames, setFrames] = useState<Frame[]>();
    const [loop, setLoop] = useState<NodeJS.Timer>();

    //
    // React state updates
    //
    const mechInitStates: MechState[] = mechInitPositions.map(
        (pos, mech_i) => { return {status: MechStatus.OPEN, index: pos, id: `mech${mech_i}`, typ: 'singleton'} }
    )
    const atomInitStates: AtomState[] = ATOM_INIT_XY.map(
        function (xy,i) { return {status:AtomStatus.FREE, index:{x:xy.x, y:xy.y}, id:`atom${i}`, typ:AtomType.VANILLA, possessed_by:null} }
    )
    const frame = frames?.[animationFrame]
    const atomStates = frame?.atoms || atomInitStates
    const mechStates = frame?.mechs || mechInitStates
    const unitStates = setVisualForStates (atomStates, mechStates, unitStatesInit) as UnitState[][]
    const delivered = frame?.delivered_accumulated
    // console.log('index.tsx delivered:', delivered)

    function isIdenticalGrid ( // somehow this is not exportable from simulator.tsx, so making a duplicate here
        grid1: Grid,
        grid2: Grid
    ): boolean {
        return JSON.stringify(grid1) == JSON.stringify(grid2)
    }

    function isGridOOB (grid: Grid): boolean {
        if (grid.x < 0 || grid.x > DIM-1 || grid.y < 0 || grid.y > DIM-1) return true;
        return false;
    }

    function areGridsNeighbors (
        grid1: Grid,
        grid2: Grid
    ): boolean {
        if (
            (grid1.x == grid2.x && Math.abs(grid1.y - grid2.y)==1) ||
            (grid1.y == grid2.y && Math.abs(grid1.x - grid2.x)==1)
        ) return true;
        return false;
    }

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

        newStates = setConfigVisualForStates (newStates)

        return newStates
    }

    //
    // Definition of setting mech's visual to DOM state
    //
    function setMechVisualForStates (mech: MechState, states: UnitState[][]){
        let newStates: UnitState[][] = JSON.parse(JSON.stringify(states)) // duplicate
        newStates[mech.index.x][mech.index.y].unit_id = mech.id
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
        let newStates: UnitState[][] = JSON.parse(JSON.stringify(states)) // duplicate
        newStates[atom.index.x][atom.index.y].unit_id = atom.id
        newStates[atom.index.x][atom.index.y].unit_text = UnitText.EMPTY
        if (atom.status == AtomStatus.FREE){
            if (atom.typ == AtomType.VANILLA) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_VANILLA_FREE
            }
            else if (atom.typ == AtomType.HAZELNUT) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_HAZELNUT_FREE
            }
        }
        else if (atom.status == AtomStatus.POSSESSED){
            if (atom.typ == AtomType.VANILLA) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_VANILLA_POSSESSED
            }
            else if (atom.typ == AtomType.HAZELNUT) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_HAZELNUT_POSSESSED
            }
        }
        return newStates
    }

    //
    // Definition of setting config's visual to DOM state (operators, faucets, sinks)
    //
    function setConfigVisualForStates (states: UnitState[][]){
        let newStates = JSON.parse(JSON.stringify(states)) // duplicate

        // Faucet & Sink
        newStates[FAUCET_POS.x][FAUCET_POS.y].unit_text = UnitText.FAUCET
        newStates[SINK_POS.x][SINK_POS.y].unit_text = UnitText.SINK

        // Operators
        if (adderStates){
            for (const adder of adderStates){
                if (isOperatorPositionInvalid(adder)) continue;
                newStates[adder.a.x][adder.a.y].unit_text = UnitText.OPERAND_ADD
                newStates[adder.b.x][adder.b.y].unit_text = UnitText.OPERAND_ADD
                newStates[adder.z.x][adder.z.y].unit_text = UnitText.OUTPUT
            }
        }

        return newStates
    }

    function isOperatorPositionInvalid (adder: BinaryOperator): boolean {
        if (
            isIdenticalGrid(adder.a, FAUCET_POS) ||
            isIdenticalGrid(adder.b, FAUCET_POS) ||
            isIdenticalGrid(adder.z, FAUCET_POS) ||
            isIdenticalGrid(adder.a, SINK_POS) ||
            isIdenticalGrid(adder.b, SINK_POS) ||
            isIdenticalGrid(adder.z, SINK_POS) ||
            isIdenticalGrid(adder.a, adder.b) ||
            isIdenticalGrid(adder.a, adder.z) ||
            isIdenticalGrid(adder.b, adder.z)
        ) return true;

        if (isGridOOB(adder.a) || isGridOOB(adder.b) || isGridOOB(adder.z)) return true;

        const isABNeighbors = areGridsNeighbors(adder.a, adder.b)
        const isBZNeighbors = areGridsNeighbors(adder.b, adder.z)

        if (!isABNeighbors || !isBZNeighbors) return true;

        return false;
    }

    // Handle click event for adding/removing mechs
    function handleMechClick (mode: string){
        if (mode === '+' && numMechs < MAX_NUM_MECHS) {
            setNumMechs (prev => prev+1)
            setMechInitPositions(
                // Array.from({length:numMechs+1}).fill({ x: MECH_INIT_X, y: MECH_INIT_Y }) as Grid[]
                prev => {
                    let prev_copy: Grid[] = JSON.parse(JSON.stringify(prev))
                    prev_copy.push ({ x: MECH_INIT_X, y: MECH_INIT_Y })
                    return prev_copy
                }
            )
            setPrograms(
                prev => {
                    let prev_copy = JSON.parse(JSON.stringify(prev))
                    prev_copy.push(INIT_PROGRAM)
                    return prev_copy
                }
            )
        }
        else if (mode === '-' && numMechs > MIN_NUM_MECHS) {
            setNumMechs (prev => prev-1)
            setMechInitPositions(
                // Array.from({length:numMechs-1}).fill({ x: MECH_INIT_X, y: MECH_INIT_Y }) as Grid[]
                prev => {
                    let prev_copy: Grid[] = JSON.parse(JSON.stringify(prev))
                    prev_copy.pop()
                    return prev_copy
                }
            )
            setPrograms(
                prev => {
                    let prev_copy = JSON.parse(JSON.stringify(prev))
                    prev_copy.pop()
                    return prev_copy
                }
            )
        }
    }

    // Handle click even for addming/removing Adder (operator)
    function handleAdderClick (mode: string){
        if (mode === '+' && numAdders < MAX_NUM_ADDERS) {
            setNumAdders (prev => prev+1)
            setAdderStates(
                prev => {
                    let prev_copy: BinaryOperator[] = JSON.parse(JSON.stringify(prev))
                    prev_copy.push ({ a:{x:0,y:0}, b:{x:0,y:0}, z:{x:0,y:0}, typ:BinaryOperatorType.ADDER })
                    return prev_copy
                }
            )
        }
        else if (mode === '-' && numAdders > MIN_NUM_ADDERS) {
            setNumAdders (prev => prev-1)
            setAdderStates(
                prev => {
                    let prev_copy: BinaryOperator[] = JSON.parse(JSON.stringify(prev))
                    prev_copy.pop ()
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
                let instructionSets:string[][] = []
                programs.forEach((program: string, mech_i:number) => {
                    const instructions = program.split(',') as string[]
                    instructionSets.push (instructions)
                })
                setInstructionSets (instructionSets)
                console.log('running instructionSets', instructionSets)

                // Prepare input
                const boardConfig: BoardConfig = {
                    dimension: DIM,
                    atom_faucets: [{id:'atom_faucet0', typ:AtomType.VANILLA, index:{x:FAUCET_POS.x, y:FAUCET_POS.y}} as AtomFaucetState],
                    atom_sinks: [{id:'atom_sink0', index:{x:SINK_POS.x, y:SINK_POS.y}} as AtomSinkState],
                    binary_operators: adderStates
                }

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
                // var n_vanilla = 0
                // for (const delivered of final_delivery){
                //     if (delivered == 'vanilla') {n_vanilla += 1}
                // }
                // console.log (`> delivered ${n_vanilla} vanilla atom(s)`)

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

    function setAdder (adder_i: number, new_adder: BinaryOperator){
        setAdderStates(
            (prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev))
                prev_copy[adder_i] = new_adder
                return prev_copy
            }
        )
    }

    const simulationLoop = (frames: Frame[]) => {
        setAnimationFrame((prev) => {
            if (prev >= frames.length - 1) {
                return 0
            }
            else {
                return prev + 1
            }
        })
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

                <p style={{fontSize:'0.9rem',marginTop:'0',marginBottom:'0'}}>Makeshift tutorial</p>
                <ol style={{width:'30rem', marginTop:'0.5rem', marginBottom:'2rem'}}>
                    <li>Only Singleton mechanism ("mech") is available, whose instruction set is [W,A,S,D] for movement, Z for pick-up, X for put-down.</li>
                    <li>_ as instruction means no-operation.</li>
                    <li>During simulation, each mech cycles through its own program on repeat.</li>
                    <li>Currently only one formula is available: try adding two red atoms by placing them at Adder's input operand grids.</li>
                </ol>

                <div style={{display:'flex', flexDirection:'row', height:'20px', marginBottom:'10px'}}>
                    <button onClick={() => handleMechClick('+')}> {'+mech'} </button>
                    <button onClick={() => handleMechClick('-')}> {'-mech'} </button>

                    <button onClick={() => handleAdderClick('+')}> {'+Adder'} </button>
                    <button onClick={() => handleAdderClick('-')}> {'-Adder'} </button>

                    <button onClick={() => handleClick('ToggleRun')}> {animationState != 'Run' ? 'Run' : 'Pause'} </button>
                    <button onClick={() => handleClick('Stop')}> {'Stop'} </button>
                    <p style={{padding:'0', textAlign:'center', verticalAlign:'middle', margin:'0', height:'20px', lineHeight:'20px', fontSize:'0.75rem'}}>Frame# {animationFrame}</p>
                </div>

                <div style={{display:'flex', flexDirection:'row'}}>
                    <div className={styles.inputs} style={{borderRight:'1px solid #333333'}}>
                        {
                            Array.from({length:numMechs}).map ((_,mech_i) => (
                                <div key={`input-row-${mech_i}`} className={styles.input_row}>
                                    <p style={{margin:'0 10px 0 0', verticalAlign:'middle', height:'20px', lineHeight:'20px'}}>{`mech${mech_i}`}</p>
                                    <input
                                        className={styles.program}
                                        onChange={event => {setMechInitX(mech_i, event.target.value)}}
                                        defaultValue={mechInitPositions[mech_i].x}
                                        style={{width:'30px', textAlign:'center'}}
                                    ></input>

                                    <input
                                        className={styles.program}
                                        onChange={event => {setMechInitY(mech_i, event.target.value)}}
                                        defaultValue={mechInitPositions[mech_i].y}
                                        style={{width:'30px', textAlign:'center'}}
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
                                        defaultValue={programs[mech_i]}
                                        style={{width:'300px'}}
                                    ></input>
                                </div>
                            ))
                        }
                    </div>

                    <div className={styles.inputs}>
                    {
                            Array.from({length:numAdders}).map ((_,adder_i) => (
                                <div key={`input-row-${adder_i}`} className={styles.input_row}>
                                    <p className={styles.input_text}>{`adder${adder_i}`}</p>
                                    <input
                                        className={styles.program}
                                        onChange={event => {
                                            if (event.target.value.length == 0) return;
                                            let newAdder = JSON.parse(JSON.stringify(adderStates[adder_i]))
                                            newAdder.a.x = parseInt(event.target.value)
                                            setAdder(adder_i, newAdder)}
                                        }
                                        defaultValue={adderStates[adder_i].a.x}
                                        style={{width:'30px', textAlign:'center'}}
                                    ></input>
                                    <input
                                        className={styles.program}
                                        onChange={event => {
                                            if (event.target.value.length == 0) return;
                                            let newAdder = JSON.parse(JSON.stringify(adderStates[adder_i]))
                                            newAdder.a.y = parseInt(event.target.value)
                                            setAdder(adder_i, newAdder)}
                                        }
                                        defaultValue={adderStates[adder_i].a.y}
                                        style={{width:'30px', textAlign:'center'}}
                                    ></input>
                                    <p className={styles.input_text}>{`+`}</p>

                                    <input
                                        className={styles.program}
                                        onChange={event => {
                                            if (event.target.value.length == 0) return;
                                            let newAdder = JSON.parse(JSON.stringify(adderStates[adder_i]))
                                            newAdder.b.x = parseInt(event.target.value)
                                            setAdder(adder_i, newAdder)}
                                        }
                                        defaultValue={adderStates[adder_i].b.x}
                                        style={{width:'30px', textAlign:'center'}}
                                    ></input>
                                    <input
                                        className={styles.program}
                                        onChange={event => {
                                            if (event.target.value.length == 0) return;
                                            let newAdder = JSON.parse(JSON.stringify(adderStates[adder_i]))
                                            newAdder.b.y = parseInt(event.target.value)
                                            setAdder(adder_i, newAdder)}
                                        }
                                        defaultValue={adderStates[adder_i].b.y}
                                        style={{width:'30px', textAlign:'center'}}
                                    ></input>
                                    <p className={styles.input_text}>{`=`}</p>

                                    <input
                                        className={styles.program}
                                        onChange={event => {
                                            if (event.target.value.length == 0) return;
                                            let newAdder = JSON.parse(JSON.stringify(adderStates[adder_i]))
                                            newAdder.z.x = parseInt(event.target.value)
                                            setAdder(adder_i, newAdder)}
                                        }
                                        defaultValue={adderStates[adder_i].z.x}
                                        style={{width:'30px', textAlign:'center'}}
                                    ></input>
                                    <input
                                        className={styles.program}
                                        onChange={event => {
                                            if (event.target.value.length == 0) return;
                                            let newAdder = JSON.parse(JSON.stringify(adderStates[adder_i]))
                                            newAdder.z.y = parseInt(event.target.value)
                                            setAdder(adder_i, newAdder)}
                                        }
                                        defaultValue={adderStates[adder_i].z.y}
                                        style={{width:'30px', textAlign:'center'}}
                                    ></input>

                                </div>
                            ))
                        }
                    </div>
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
                                        />
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>

                <div className={styles.delivered_atoms}>
                    {/* Delivered: {delivered?.length || 0} x
                    <Unit
                        state={{
                            bg_status: BgStatus.ATOM_VANILLA_FREE,
                            border_status: null,
                            unit_text: UnitText.EMPTY,
                            unit_id: null
                        }}
                    /> */}
                    <Delivery delivered={delivered} />
                </div>
            </main>

        </div>
    )
}
