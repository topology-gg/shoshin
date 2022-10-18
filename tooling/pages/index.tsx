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
import Operator, { OperatorType, OPERATOR_TYPES } from '../src/types/Operator';
import Delivery from './delivery'
import Tutorial from './tutorial';
import MechInput from '../src/components/MechInput';
// import
import { isIdenticalGrid, isGridOOB, areGridsNeighbors } from '../src/helpers/gridHelpers';

export default function Home() {

    // Constants
    const N_CYCLES = 100
    const ANIM_FRAME_LATENCY = 250
    const INIT_PROGRAM = '_'
    const DIM = 10
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
    const MAX_NUM_MECHS = 10
    const MIN_NUM_MECHS = 1
    const MAX_NUM_ADDERS = 5
    const MIN_NUM_ADDERS = 0

    // React states for mechs & programs
    const [numMechs, setNumMechs] = useState(8)
    const [programs, setPrograms] = useState<string[]>([
        'Z,D,X,A,_,_,_,_,_,_,_',
        '_,Z,D,D,X,A,A,_,_,_,_',
        '_,_,Z,S,D,X,A,W,_,_,_',
        '_,_,_,Z,S,D,D,X,A,A,W',
        'Z,D,X,A',
        'Z,D,X,A',
        'Z,S,X,W,Z,S,D,X,A,W',
        'Z,S,S,A,X,D,W,W',
    ]);
    const [mechInitPositions, setMechInitPositions] = useState<Grid[]> ([
        { x:0, y:0 },
        { x:0, y:0 },
        { x:0, y:0 },
        { x:0, y:0 },
        { x:3, y:0 },
        { x:3, y:1 },
        { x:4, y:2 },
        { x:4, y:1 },
    ])
    const [instructionSets, setInstructionSets] = useState<string[][]>();

    // React states for operators
    const [numAdders, setNumAdders] = useState(4)
    const [operatorStates, setOperatorStates] = useState<Operator[]> ([
        { input:[{x:1,y:0}, {x:2,y:0}], output:[{x:3,y:0}], typ:OPERATOR_TYPES.STIR},
        { input:[{x:1,y:1}, {x:2,y:1}], output:[{x:3,y:1}], typ:OPERATOR_TYPES.STIR},
        { input:[{x:4,y:0}, {x:4,y:1}], output:[{x:4,y:2}], typ:OPERATOR_TYPES.SHAKE},
        { input:[{x:3,y:3}, {x:4,y:3}, {x:5,y:3}], output:[{x:5,y:4},{x:6,y:4}], typ:OPERATOR_TYPES.STEAM},
    ])

    // React states for animation control
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

        // TODO: refactor the following code
        if (atom.status == AtomStatus.FREE){
            if (atom.typ == AtomType.VANILLA) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_VANILLA_FREE
            }
            else if (atom.typ == AtomType.HAZELNUT) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_HAZELNUT_FREE
            }
            else if (atom.typ == AtomType.CHOCOLATE) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_CHOCOLATE_FREE
            }
            else if (atom.typ == AtomType.TRUFFLE) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_TRUFFLE_FREE
            }
        }
        else if (atom.status == AtomStatus.POSSESSED){
            if (atom.typ == AtomType.VANILLA) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_VANILLA_POSSESSED
            }
            else if (atom.typ == AtomType.HAZELNUT) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_HAZELNUT_POSSESSED
            }
            else if (atom.typ == AtomType.CHOCOLATE) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_CHOCOLATE_POSSESSED
            }
            else if (atom.typ == AtomType.TRUFFLE) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_TRUFFLE_POSSESSED
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
        if (operatorStates && !isAnyOperatorPositionInvalid(operatorStates)){
            for (const operator of operatorStates){
                if (isOperatorPositionInvalid(operator)) continue;

                for (const grid of operator.input){
                    newStates[grid.x][grid.y].unit_text = operator.typ.symbol
                }
                for (const grid of operator.output){
                    newStates[grid.x][grid.y].unit_text = UnitText.OUTPUT
                }
            }
        }

        return newStates
    }

    function isAnyOperatorPositionInvalid (operators: Operator[]): boolean{
        // Check that the current adder's a,b,z + faucet's loc + sink's loc + all other operators' locs are all unique values,
        // otherwise, return true (adder position invalid)
        // note: Set() works for primitive types, hence stringify index object into string
        var adder_indices_in_str = []
        operators.forEach(function (operator: Operator) {
            for (const grid of operator.input){
                adder_indices_in_str = [...adder_indices_in_str, JSON.stringify(grid)]
            }
            for (const grid of operator.output){
                adder_indices_in_str = [...adder_indices_in_str, JSON.stringify(grid)]
            }
        })
        const faucet_sink_indices_in_str = [JSON.stringify(FAUCET_POS), JSON.stringify(SINK_POS)]
        const all_indices = adder_indices_in_str.concat (faucet_sink_indices_in_str)
        const unique_indices = all_indices.filter(onlyUnique)

        // if unique operation reduces array length, we have duplicate indices
        if (all_indices.length != unique_indices.length) {
            return true;
        }

        return false;
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function isOperatorPositionInvalid (operator: Operator): boolean {

        const grid_array = operator.input.concat (operator.output)
        for (const grid of grid_array){
            if (isGridOOB(grid, DIM)) return true;
        }

        Array.from({length: grid_array.length - 1}).forEach((_,i) => {
            if (areGridsNeighbors(grid_array[i], grid_array[i+1])) return true;
        })

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
            setOperatorStates(
                prev => {
                    let prev_copy: Operator[] = JSON.parse(JSON.stringify(prev))
                    prev_copy.push ({ input:[{x:0,y:0}, {x:0,y:0}], output:[{x:0,y:0}], typ:OPERATOR_TYPES.STIR})
                    return prev_copy
                }
            )
        }
        else if (mode === '-' && numAdders > MIN_NUM_ADDERS) {
            setNumAdders (prev => prev-1)
            setOperatorStates(
                prev => {
                    let prev_copy: Operator[] = JSON.parse(JSON.stringify(prev))
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
                    operators: operatorStates
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

                simulatedFrames.forEach((f:Frame,frame_i:number) => {
                    // const s = f.atoms.map(function(v){return JSON.stringify(v)}).join('\n')
                    // console.log(frame_i, f.atoms)
                    console.log(frame_i, f.notes)
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

    function setMechInitPosition (mech_i: number, position: Grid){
        if (position.x < DIM && position.x >= 0 && position.y < DIM && position.y >= 0) {
            setMechInitPositions(
                // (prev) => ({ ...prev, [mech_i]: position })
                (prev) => {
                    let prev_copy = JSON.parse(JSON.stringify(mechInitPositions))
                    prev_copy[mech_i] = position
                    return prev_copy
                }
            )
        }
    }

    function setOperator (operator_i: number, new_operator: Operator){
        setOperatorStates(
            (prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev))
                prev_copy[operator_i] = new_operator
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

                <Tutorial />

                <div style={{display:'flex', flexDirection:'row', height:'20px', marginBottom:'10px'}}>
                    <button onClick={() => handleMechClick('+')}> {'+mech'} </button>
                    <button onClick={() => handleMechClick('-')}> {'-mech'} </button>

                    <button onClick={() => handleAdderClick('+')}> {'+&'} </button>
                    <button onClick={() => handleAdderClick('-')}> {'-&'} </button>

                    <button onClick={() => handleClick('ToggleRun')}> {animationState != 'Run' ? 'Run' : 'Pause'} </button>
                    <button onClick={() => handleClick('Stop')}> {'Stop'} </button>
                    <p style={{padding:'0', textAlign:'center', verticalAlign:'middle', margin:'0', height:'20px', lineHeight:'20px', fontSize:'0.75rem'}}>Frame# {animationFrame}</p>
                </div>

                <div style={{display:'flex', flexDirection:'row'}}>
                    <div className={styles.inputs} style={{borderRight:'1px solid #333333'}}>
                        {
                            Array.from({length:numMechs}).map ((_,mech_i) => (
                                <MechInput
                                    key={`mech-input-${mech_i}`}
                                    mechIndex={mech_i}
                                    position={mechInitPositions[mech_i]}
                                    program={programs[mech_i]}
                                    animationFrame={animationFrame}
                                    onPositionChange={(index, position) => setMechInitPosition(index, position)}
                                    onProgramChange={(index, program) =>
                                        setPrograms((prev) => (prev.map((p, i) => i === index ? program : p)))
                                    }
                                />
                            ))
                        }
                    </div>

                    <div className={styles.inputs}>
                    {
                            Array.from({length:numAdders}).map ((_,operator_i) => (
                                <div key={`input-row-${operator_i}`} className={styles.input_row}>
                                    <p className={styles.input_text}>{`adder${operator_i}`}</p>

                                    {
                                        Array.from({length:operatorStates[operator_i].input.length}).map((_,input_i) => (
                                            <div className={styles.input_grid}>
                                                <input
                                                    className={styles.program}
                                                    onChange={event => {
                                                        if (event.target.value.length == 0) return;
                                                        let newOperator = JSON.parse(JSON.stringify(operatorStates[operator_i]))
                                                        newOperator.input[input_i].x = parseInt(event.target.value)
                                                        setOperator(operator_i, newOperator)}
                                                    }
                                                    defaultValue={operatorStates[operator_i].input[input_i].x}
                                                    style={{width:'30px', textAlign:'center'}}
                                                ></input>
                                                <input
                                                    className={styles.program}
                                                    onChange={event => {
                                                        if (event.target.value.length == 0) return;
                                                        let newOperator = JSON.parse(JSON.stringify(operatorStates[operator_i]))
                                                        newOperator.input[input_i].y = parseInt(event.target.value)
                                                        setOperator(operator_i, newOperator)}
                                                    }
                                                    defaultValue={operatorStates[operator_i].input[input_i].y}
                                                    style={{width:'30px', textAlign:'center'}}
                                                ></input>
                                                {
                                                    input_i == operatorStates[operator_i].input.length-1 ? (
                                                        <p className={styles.input_text}>{`=`}</p>
                                                    ) : (
                                                        <p className={styles.input_text}>{operatorStates[operator_i].typ.symbol}</p>
                                                    )

                                                }
                                            </div>
                                        ))
                                    }

                                    {
                                        Array.from({length:operatorStates[operator_i].output.length}).map((_,output_i) => (
                                            <div className={styles.input_grid}>
                                                <input
                                                    className={styles.program}
                                                    onChange={event => {
                                                        if (event.target.value.length == 0) return;
                                                        let newOperator = JSON.parse(JSON.stringify(operatorStates[operator_i]))
                                                        newOperator.output[output_i].x = parseInt(event.target.value)
                                                        setOperator(operator_i, newOperator)}
                                                    }
                                                    defaultValue={operatorStates[operator_i].output[output_i].x}
                                                    style={{width:'30px', textAlign:'center'}}
                                                ></input>
                                                <input
                                                    className={styles.program}
                                                    onChange={event => {
                                                        if (event.target.value.length == 0) return;
                                                        let newOperator = JSON.parse(JSON.stringify(operatorStates[operator_i]))
                                                        newOperator.output[output_i].y = parseInt(event.target.value)
                                                        setOperator(operator_i, newOperator)}
                                                    }
                                                    defaultValue={operatorStates[operator_i].output[output_i].y}
                                                    style={{width:'30px', textAlign:'center'}}
                                                ></input>
                                                {
                                                    (output_i != operatorStates[operator_i].output.length-1) &&
                                                    <p className={styles.input_text}>{`,`}</p>
                                                }
                                            </div>
                                        ))
                                    }

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
                    <Delivery delivered={delivered} />
                </div>
            </main>

        </div>
    )
}
