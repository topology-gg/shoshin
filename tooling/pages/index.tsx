import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import simulator from "./simulator";
import MechState, { MechStatus, MechType } from '../src/types/MechState';
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
import Summary from './summary';
import Tutorial from './tutorial';
import MechInput from '../src/components/MechInput';
import { isIdenticalGrid, isGridOOB, areGridsNeighbors } from '../src/helpers/gridHelpers';
import OperatorGridBg from '../src/components/OperatorGridBg';
import { DIM, PROGRAM_SIZE_MAX, DEMO_SOLUTIONS } from '../src/constants/constants';
import { useTranslation } from 'react-i18next';
import "../config/i18n"
import LanguageSelector from '../src/components/LanguageSelector';
import ConnectWalletStardisc from '../src/components/ConnectWalletStardisc'
import { useAccount, useStarknetExecute } from '@starknet-react/core'
import packSolution, { programsToInstructionSets } from '../src/helpers/packSolution';
import { SIMULATOR_ADDR } from '../src/components/SimulatorContract';
import Solution from '../src/types/Solution';
import Leaderboard from '../src/components/Leaderboard';
import { createTheme, ThemeProvider, Tooltip } from '@mui/material';
import {
    saveSolutionToLocal,
    getSolutionFromLocal,
    getNamespaceFromLocal,
    removeSolutionFromLocal,
} from '../src/helpers/localStorage'
import SavedSolutionElement from '../src/components/savedSolutionElement';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { reorder } from '../src/helpers/reorder';

const theme = createTheme({
    typography: {
        fontFamily: "Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;"
    },
});

export default function Home() {

    // Constants
    const N_CYCLES = 80
    const ANIM_FRAME_LATENCY = 250
    const INIT_PROGRAM = '_'
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
    const SINK_POS_S: Grid[] = [
        {x:0,     y:DIM-1},
        {x:DIM-1, y:0},
        {x:DIM-1, y:DIM-1},
    ]
    const MAX_NUM_MECHS = 20
    const MIN_NUM_MECHS = 0
    const MAX_NUM_OPERATORS = 20
    const MIN_NUM_OPERATORS = 0

    const { t } = useTranslation();

    // React states for lifecycle
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, [])

    // React states for mechs & programs
    const [numMechs, setNumMechs] = useState(DEMO_SOLUTIONS[0].programs.length)
    const [programs, setPrograms] = useState<string[]>(DEMO_SOLUTIONS[0].programs);
    const [mechInitPositions, setMechInitPositions] = useState<Grid[]> (DEMO_SOLUTIONS[0].mechs.map(mech => mech.index))
    const [instructionSets, setInstructionSets] = useState<string[][]>();

    // React states for operators
    const [numOperators, setNumOperators] = useState(DEMO_SOLUTIONS[0].operators.length)
    const [operatorStates, setOperatorStates] = useState<Operator[]> (DEMO_SOLUTIONS[0].operators)

    // React useMemo
    const calls = useMemo (() => {

        let instructionSets = programsToInstructionSets (programs)
        const args = packSolution (instructionSets, mechInitPositions, operatorStates)
        // console.log ('> useMemo: args =', args)

        const tx = {
            contractAddress: SIMULATOR_ADDR,
            entrypoint: 'simulator',
            calldata: args
        }
        return [tx]

    }, [instructionSets, mechInitPositions, operatorStates])

    // React states for animation control
    const [animationState, setAnimationState] = useState ('Stop');
    const [animationFrame, setAnimationFrame] = useState<number> (0)
    const [frames, setFrames] = useState<Frame[]>();
    const [loop, setLoop] = useState<NodeJS.Timer>();
    const [viewSolution, setViewSolution] = useState<Solution>(DEMO_SOLUTIONS[0]);

    // React states for UI
    const [gridHovering, setGridHovering] = useState<[string, string]>(['-','-'])

    let operatorInputHighlightInit: boolean[] = Array(numOperators).fill(false)
    const [operatorInputHighlight, setOperatorInputHighlight] = useState<boolean[]>(operatorInputHighlightInit)
    const [operatorStyles, setOperatorStyles] = useState<React.CSSProperties[]>([{}])

    const [mechIndexHighlighted, setMechIndexHighlighted] = useState<number>(-1)

    // Local storage
    const DEFAULT_SAVE_TO_NAME = ''
    const [saveToName, setSaveToName] = useState<string>(DEFAULT_SAVE_TO_NAME)
    const saveButtonStyle = mounted ? computeSaveButtonStyle() : {}

    const initNamespace: string[] = getNamespaceFromLocal();
    const [namespace, setNamespace] = useState<string[]>(initNamespace);

    //
    // States derived from React states
    //
    const runnable = isRunnable()
    const mechInitStates: MechState[] = mechInitPositions.map(
        (pos, mech_i) => { return {status: MechStatus.OPEN, index: pos, id: `mech${mech_i}`, typ: MechType.SINGLETON, pc_next: 0} }
    )
    const atomInitStates: AtomState[] = ATOM_INIT_XY.map(
        function (xy,i) { return {status:AtomStatus.FREE, index:{x:xy.x, y:xy.y}, id:`atom${i}`, typ:AtomType.VANILLA, possessed_by:null} }
    )
    const frame = frames?.[animationFrame]
    const atomStates = frame?.atoms || atomInitStates
    // const mechStates = frame?.mechs || mechInitStates
    const mechStates = (frame && (animationState!='Stop')) ? frame.mechs : mechInitStates
    const unitStates = setVisualForStates (atomStates, mechStates, unitStatesInit) as UnitState[][]
    const delivered = frame?.delivered_accumulated
    const cost_accumulated = animationState=='Stop' ? 0 :frame?.cost_accumulated

    // Starknet
    const { account, address, status } = useAccount ()
    const { execute } = useStarknetExecute ({ calls })

    ////////////////////

    //
    // Style the Run button based on solution legality == operator placement legality && mech initial placement legality
    //
    function isRunnable () {
        // impurity by dependencies: operatorStates, mechInitPosition, programs
        if (!isOperatorPlacementLegal()) {
            console.log ("> simulation not runnable because of operator placement illegality")
            return false;
        }
        if (!isMechInitialPlacementLegal()) {
            console.log ("> simulation not runnable because of mech initial placement illegality")
            return false;
        }

        for (const program of programs) {
            const instructions = program.split(',') as string[]
            if (instructions.length > PROGRAM_SIZE_MAX) return false;
        }

        return true;
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

        // duplicate
        let newStates: UnitState[][] = JSON.parse(JSON.stringify(states))

        // if this mech is positioned illegally, don't render it
        if (isGridOOB(mech.index, DIM)) {
            return newStates
        }

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
            else if (atom.typ == AtomType.SAFFRON) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_SAFFRON_FREE
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
            else if (atom.typ == AtomType.SAFFRON) {
                newStates[atom.index.x][atom.index.y].bg_status = BgStatus.ATOM_SAFFRON_POSSESSED
            }
        }
        return newStates
    }

    //
    // Function to check operator placement validity
    // Note: surfaced by Dham playtesting in Lisbon prior to the MovyMovy talk
    //
    function isOperatorPlacementLegal () {
        // impurity by dependencies: operatorStates, constants such as faucet and sink positions

        if (!operatorStates) return false;
        if (isAnyOperatorPositionInvalid(operatorStates)) return false;

        for (const operator of operatorStates){
            if (isOperatorPositionInvalid(operator)) return false;
        }

        return true;
    }

    //
    // Function to check mech initial placement validity
    //
    function isMechInitialPlacementLegal () {
        for (const pos of mechInitPositions) {
            if (isGridOOB(pos, DIM)) return false;
        }
        return true;
    }

    //
    // Definition of setting config's visual to DOM state (operators, faucets, sinks)
    //
    function setConfigVisualForStates (states: UnitState[][]){
        let newStates = JSON.parse(JSON.stringify(states)) // duplicate

        // Faucet & Sink
        newStates[FAUCET_POS.x][FAUCET_POS.y].unit_text = UnitText.FAUCET

        for (const sink_pos of SINK_POS_S) {
            newStates[sink_pos.x][sink_pos.y].unit_text = UnitText.SINK
        }

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

        let faucet_sink_indices_in_str = SINK_POS_S.map (sink_pos => JSON.stringify(sink_pos))
        faucet_sink_indices_in_str.push (JSON.stringify(FAUCET_POS)) // there's only one faucet

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

        // Each operator grid needs to be neighbor with the next grid
        return Array.from({length: grid_array.length - 1}).some((_,i) => {
            return !areGridsNeighbors(grid_array[i], grid_array[i+1]);
        })
    }

    // Handle click event for adding/removing mechs
    function handleMechClick (mode: string){
        if (animationState != 'Stop') return; // only when in Stop mode can player add/remove mechs
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
    function handleOperatorClick (mode: string, typ: string){
        if (mode === '+' && numOperators < MAX_NUM_OPERATORS) {
            setNumOperators (prev => prev+1)
            setOperatorStates(
                prev => {
                    let prev_copy: Operator[] = JSON.parse(JSON.stringify(prev))
                    switch(typ){
                        case 'STIR':
                            prev_copy.push ({ input:[{x:0,y:0}, {x:0,y:0}], output:[{x:0,y:0}], typ:OPERATOR_TYPES.STIR})
                            break;
                        case 'SHAKE':
                            prev_copy.push ({ input:[{x:0,y:0}, {x:0,y:0}], output:[{x:0,y:0}], typ:OPERATOR_TYPES.SHAKE})
                            break;
                        case 'STEAM':
                            prev_copy.push ({ input:[{x:0,y:0}, {x:0,y:0}, {x:0,y:0}], output:[{x:0,y:0}, {x:0,y:0}], typ:OPERATOR_TYPES.STEAM})
                            break;
                        case 'SMASH':
                            prev_copy.push ({ input:[{x:0,y:0}], output:[{x:0,y:0}, {x:0,y:0}, {x:0,y:0}, {x:0,y:0}, {x:0,y:0}], typ:OPERATOR_TYPES.SMASH})
                            break;
                        default:
                            throw `invalid operator type encountered: ${typ}`

                    }
                    return prev_copy
                }
            )
        }
        else if (mode === '-' && numOperators > MIN_NUM_OPERATORS) {
            setNumOperators (prev => prev-1)
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
    // Handle click event for submitting solution to StarkNet
    //
    function handleClickSubmit () {
        if (!account) {
            console.log ("> wallet not connected yet")
        }

        console.log ('> connected address:', String(address))

        // submit tx
        console.log ('> submitting args to simulator() on StarkNet:', calls)
        execute()

        return;
    }

    //
    // Handle click event for animation control
    //
    function handleClick (mode: string){

        if (mode == 'NextFrame' && animationState != 'Run') {
            if (!frames) return;
            setAnimationFrame (prev => prev < N_CYCLES ? prev + 1 : prev)
        }
        else if (mode == 'PrevFrame' && animationState != 'Run') {
            if (!frames) return;
            setAnimationFrame (prev => prev > 0 ? prev - 1 : prev)
        }

        // Run simulation
        else if (mode == 'ToggleRun') {

            // If in Run => go to Pause
            if (animationState == 'Run') {
                clearInterval (loop); // kill the timer
                setAnimationState ('Pause')
            }

            // If in Pause => resume Run without simulation
            else if (animationState == 'Pause') {
                // Begin animation
                setAnimationState ('Run')
                setLoop(
                    setInterval(() => {
                        simulationLoop(frames)
                    }, ANIM_FRAME_LATENCY)
                );
            }

            // If in Stop => perform simulation then go to Run
            else if (animationState == 'Stop' && runnable) {

                // Parse program into array of instructions and store to react state
                let instructionSets = programsToInstructionSets (programs)
                setInstructionSets (instructionSets)
                // console.log('running instructionSets', instructionSets)

                // Prepare input
                const boardConfig: BoardConfig = {
                    dimension: DIM,
                    atom_faucets: [{id:'atom_faucet0', typ:AtomType.VANILLA, index:{x:FAUCET_POS.x, y:FAUCET_POS.y}} as AtomFaucetState],
                    // atom_sinks: [{id:'atom_sink0', index:{x:SINK_POS.x, y:SINK_POS.y}} as AtomSinkState],
                    atom_sinks: SINK_POS_S.map ( (sink_pos, index) => {
                        return {
                            id: `atom_sink${index}`,
                            index: {x: sink_pos.x, y: sink_pos.y}
                        }
                    }),
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
                    // console.log(frame_i, f.notes)
                })
                const final_delivery = simulatedFrames[simulatedFrames.length-1].delivered_accumulated

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
        // if (position.x < DIM && position.x >= 0 && position.y < DIM && position.y >= 0) {
        setMechInitPositions(
            // (prev) => ({ ...prev, [mech_i]: position })
            (prev) => {
                let prev_copy = JSON.parse(JSON.stringify(mechInitPositions))
                prev_copy[mech_i] = position
                return prev_copy
            }
        )
        // }
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

    function handleSlideChange (evt) {
        if (animationState=='Run') return;

        const slide_val: number = parseInt(evt.target.value)
        setAnimationFrame (slide_val)
    }

    function handleMouseOver (i: number,j: number) {
        const gridString: [string, string] = [i.toString(), j.toString()]
        setGridHovering (gridString)
    }

    function handleMouseOut () {
        setGridHovering (['-', '-'])
    }

    function handleLoadSolutionClick (viewSolution: Solution) {
        if (animationState != 'Stop') return;

        console.log ('load solution:', viewSolution)
        setViewSolution (prev => viewSolution)

        setNumMechs (prev => viewSolution.mechs.length)
        setPrograms (prev => viewSolution.programs)
        setMechInitPositions (prev => viewSolution.mechs.map(mech => mech.index))
        setNumOperators (prev => viewSolution.operators.length)
        setOperatorStates (prev => viewSolution.operators)
    }

    function handleMouseOverOperatorInput (operator_i: number) {
        let newHighlight = []
        let newOperatorStyles: React.CSSProperties[] = []
        for (let i=0; i<numOperators; i++){
            if (i==operator_i){
                newHighlight.push (true)
                newOperatorStyles.push ({backgroundColor:'#FFFE71'})
            }
            else {
                newHighlight.push (false)
                newOperatorStyles.push ({})
            }

        }
        setOperatorInputHighlight(prev => newHighlight)
        setOperatorStyles(prev => newOperatorStyles)
    }

    function handleMouseOutOperatorInput (operator_i: number) {
        let newHighlight = []
        let newOperatorStyles: React.CSSProperties[] = []
        for (let i=0; i<numOperators; i++){
            newHighlight.push (false)
            newOperatorStyles.push ({})
        }
        setOperatorInputHighlight(prev => newHighlight)
        setOperatorStyles(prev => newOperatorStyles)
    }

    function handleMouseOverMechInput (mech_i: number) {
        setMechIndexHighlighted(prev => mech_i)
    }

    function handleMouseOutMechInput (mech_i: number) {
        setMechIndexHighlighted(prev => -1)
    }

    function computeSaveButtonStyle (): React.CSSProperties {

        if (typeof window == "undefined") return;

        let valid = true

        // rejecting 'namespace'
        if (saveToName == 'namespace') {
            // console.log ('> rejecting namespace as name')
            valid = false;
        }

        // rejecting empty string
        else if (saveToName.length == 0) {
            // console.log ('> rejecting empty string as name')
            valid = false;
        }

        // check for collision
        else {
            const namespaceStr = localStorage.getItem('namespace')
            if (namespaceStr) {
                const namespace: string[] = JSON.parse(namespaceStr)
                if (namespace.includes(saveToName)){
                    // console.log (`> rejecting ${saveToName} because of collision`)
                    valid = false;
                }
            }
        }

        // affect style
        if (valid) return {}
        else return {pointerEvents:'none', backgroundColor:'gray'}
    }

    function handleSaveClick () {
        const solution: Solution = {
            mechs: mechStates,
            programs: programs,
            operators: operatorStates
        }
        saveSolutionToLocal (saveToName, solution)
        console.log('> saved solution:', solution)
        const newNamespace: string[] = getNamespaceFromLocal()
        setNamespace (prev => newNamespace) // trigger rerender
    }
    function handleClearClick () {
        const namespace: string[] = getNamespaceFromLocal()
        namespace.forEach((name,name_i) => {
            removeSolutionFromLocal (name)
            console.log ('remove saved solution:', name)
        })
        const newNamespace: string[] = getNamespaceFromLocal()
        setNamespace (prev => newNamespace) // trigger rerender
    }

    const onDragEnd = ({ destination, source }: DropResult) => {
        // dropped outside the list
        if (!destination) return;

        const newPrograms = reorder(programs, source.index, destination.index);
        const newPositions = reorder(mechInitPositions, source.index, destination.index);

        setPrograms(newPrograms);
        setMechInitPositions(newPositions);
    };

    // Lazy style objects
    const makeshift_button_style = {marginLeft:'0.2rem', marginRight:'0.2rem', height:'1.5rem'}
    const makeshift_run_button_style = runnable ? makeshift_button_style : {...makeshift_button_style, color: '#CCCCCC'}

    // Render
    return (
        <div className={styles.container}>
            <Head>
                <title>MuMu</title>
                <meta name="MuMu" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ThemeProvider theme={theme}>
                <main className={styles.main}>
                    <div className={styles.title}>
                        <h2>{t("MuMu")}</h2>
                        <p>{t("Subtitle")}</p>
                    </div>

                    <ConnectWalletStardisc />

                    <LanguageSelector />

                    <Tutorial />

                    <div style={{marginBottom:'1rem'}}>
                        <p style={{
                            padding:'0', textAlign:'center', verticalAlign:'middle',
                            margin:'0', height:'20px', lineHeight:'20px', fontSize:'0.9rem'}}
                        > {t("frame")} # {animationFrame} </p>

                        <input
                            id="typeinp"
                            type="range"
                            min="0" max={N_CYCLES}
                            value={animationFrame}
                            onChange={handleSlideChange}
                            step="1"
                            style={{width:'20rem'}}
                        />
                    </div>

                    <div style={{display:'flex', flexDirection:'row', height:'20px', marginBottom:'1rem'}}>
                        <button style={makeshift_button_style} onClick={() => handleMechClick('+')}>{t('newMech')}</button>
                        <button style={makeshift_button_style} onClick={() => handleMechClick('-')}>{t('removeMech')} </button>

                        <div style={{fontSize:'0.9rem', marginLeft:'0.4rem', marginRight:'0.4rem'}}>|</div>

                        <button style={makeshift_button_style} onClick={() => handleOperatorClick('+', 'STIR')}>
                        {t('newOperation', {operation: '&'})}
                        </button>
                        <button style={makeshift_button_style} onClick={() => handleOperatorClick('+', 'SHAKE')}>
                        {t('newOperation', {operation: '%'})}
                        </button>
                        <button style={makeshift_button_style} onClick={() => handleOperatorClick('+', 'STEAM')}>
                        {t('newOperation', {operation: '^'})}
                        </button>
                        <button style={makeshift_button_style} onClick={() => handleOperatorClick('+', 'SMASH')}>
                        {t('newOperation', {operation: '#'})}
                        </button>
                        <button style={makeshift_button_style} onClick={() => handleOperatorClick('-', '')}>
                        {t('removeOp')}
                        </button>

                        <div style={{fontSize:'0.9rem', marginLeft:'0.4rem', marginRight:'0.4rem'}}>|</div>

                        {/* ref: https://stackoverflow.com/questions/22885702/html-for-the-pause-symbol-in-audio-and-video-control */}
                        <button style={makeshift_run_button_style} onClick={() => handleClick('ToggleRun')}> {
                            animationState != 'Run' ? <i className="material-icons" style={{fontSize:'1.2rem'}}>play_arrow</i>
                            :
                            <i className="material-icons" style={{fontSize:'1.2rem'}}>pause</i>

                        } </button>
                        <button style={makeshift_button_style} onClick={() => handleClick('Stop')}>
                            <i className="material-icons" style={{fontSize:'1.2rem'}}>stop</i>
                        </button>

                        <button style={makeshift_button_style} onClick={() => handleClick('PrevFrame')}> {t('decrementFrame')} </button>
                        <button style={makeshift_button_style} onClick={() => handleClick('NextFrame')}> {t('incrementFrame')} </button>

                        <div style={{fontSize:'0.9rem', marginLeft:'0.4rem', marginRight:'0.4rem'}}>|</div>

                        <button id={'submit-button'} onClick={() => handleClickSubmit()}> {t('Submit to')} </button>
                    </div>

                    <div style={{display:'flex', flexDirection:'row', height:'20px', marginBottom:'1rem'}}>
                        {
                            Array.from({length:DEMO_SOLUTIONS.length}).map((_,i) => (
                                i == 0 ?
                                <button key={`load-demo-${i}`} onClick={() => handleLoadSolutionClick(DEMO_SOLUTIONS[0])}>{t('demo-blank')}</button>
                                :
                                <button key={`load-demo-${i}`} onClick={() => handleLoadSolutionClick(DEMO_SOLUTIONS[i])}>{t(`demo`)}{i-1}</button>
                            ))
                        }
                        {
                            !mounted ? <div/> : namespace.length == 0 ? <div/> : <div style={{fontSize:'0.9rem', marginLeft:'0.4rem', marginRight:'0.4rem'}}>|</div>
                        }
                        {
                            mounted ?
                            namespace.map((name: string,name_i: number) => {
                                return (
                                    <SavedSolutionElement key={`saved-solution-element-${name_i}`} name={name} onClick={() => {
                                        const solution = getSolutionFromLocal (name)
                                        handleLoadSolutionClick (solution)
                                    }}/>
                                )
                            }):
                            <div/>
                        }
                        <div style={{fontSize:'0.9rem', marginLeft:'0.4rem', marginRight:'0.4rem'}}>|</div>

                        <input
                            onChange = {event => {setSaveToName(prev => event.target.value)}}
                            defaultValue = {DEFAULT_SAVE_TO_NAME}
                            style={{width:'7rem', margin:'0 3px 0 3px', height:'24px'}}
                            placeholder={'save to name'}
                        ></input>
                        <button
                            onClick={() => {handleSaveClick()}}
                            style={saveButtonStyle}
                        > Save </button>
                        <button
                            onClick={() => {handleClearClick()}}
                        > Clear </button>
                    </div>

                        <div className={styles.programming_interface}>
                            <p style={{fontSize:'0.9rem', marginTop:'0'}}>Formula placement</p>
                            {
                                Array.from({length:numOperators}).map ((_,operator_i) => (
                                    <div key={`input-row-${operator_i}`} className={styles.input_row}
                                        onMouseOver={() => handleMouseOverOperatorInput(operator_i)}
                                        onMouseOut={() => handleMouseOutOperatorInput(operator_i)}
                                        style={operatorStyles[operator_i]}
                                    >
                                        <p className={styles.input_name}>{t(operatorStates[operator_i].typ.name)}</p>

                                        {
                                            Array.from({length:operatorStates[operator_i].input.length}).map((_,input_i) => (
                                                <div key={`input-row-${operator_i}-input-${input_i}`} className={styles.input_grid}>
                                                    {
                                                        input_i == 0 ? (
                                                            <p style={{textAlign:'right'}} className={styles.input_text}>{operatorStates[operator_i].typ.symbol}(</p>
                                                        ) : (<></>)
                                                    }
                                                    <input
                                                        className={styles.program}
                                                        onChange={event => {
                                                            // if (event.target.value.length == 0) return;
                                                            if (isNaN(parseInt(event.target.value))) return;
                                                            let newOperator = JSON.parse(JSON.stringify(operatorStates[operator_i]))
                                                            newOperator.input[input_i].x = parseInt(event.target.value)
                                                            setOperator(operator_i, newOperator)}
                                                        }
                                                        defaultValue={operatorStates[operator_i].input[input_i].x}
                                                        style={{width:'30px', textAlign:'center'}}
                                                        disabled = {animationState == 'Stop' ? false : true}
                                                    ></input>
                                                    <input
                                                        className={styles.program}
                                                        onChange={event => {
                                                            // if (event.target.value.length == 0) return;
                                                            if (isNaN(parseInt(event.target.value))) return;
                                                            let newOperator = JSON.parse(JSON.stringify(operatorStates[operator_i]))
                                                            newOperator.input[input_i].y = parseInt(event.target.value)
                                                            setOperator(operator_i, newOperator)}
                                                        }
                                                        defaultValue={operatorStates[operator_i].input[input_i].y}
                                                        style={{width:'30px', textAlign:'center'}}
                                                        disabled = {animationState == 'Stop' ? false : true}
                                                    ></input>
                                                    {
                                                        input_i == operatorStates[operator_i].input.length-1 ? (
                                                            <p className={styles.input_text}>{`)=`}</p>
                                                        ) : (
                                                            <p className={styles.input_text}>{', '}</p>
                                                        )
                                                    }
                                                </div>
                                            ))
                                        }

                                        {
                                            Array.from({length:operatorStates[operator_i].output.length}).map((_,output_i) => (
                                                <div key={`input-row-${operator_i}-input-${output_i}`} className={styles.input_grid}>
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
                                                        disabled = {animationState == 'Stop' ? false : true}
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
                                                        disabled = {animationState == 'Stop' ? false : true}
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

                        <div className={styles.programming_interface} style={{padding: '2rem',borderBottom:'1px solid #333333'}}>
                            <p style={{fontSize:'0.9rem', marginTop:'0'}}>Mech programming</p>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId='mech-input-list' isDropDisabled={animationState !== 'Stop'}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            {(animationState=='Stop') ?
                                                Array.from({length:numMechs}).map ((_,mech_i) => (
                                                    <MechInput
                                                        key={`mech-input-${mech_i}`}
                                                        mechIndex={mech_i}
                                                        position={mechInitPositions[mech_i]}
                                                        program={programs[mech_i]}
                                                        pc={0}
                                                        onPositionChange={(index, position) => {
                                                            setMechInitPosition(index, position);
                                                        }}
                                                        onProgramChange={(index, program) =>
                                                            setPrograms((prev) => (prev.map((p, i) => i === index ? program : p)))
                                                        }
                                                        disabled = {animationState == 'Stop' ? false : true}
                                                        handleMouseOver={() => {handleMouseOverMechInput(mech_i)}}
                                                        handleMouseOut={() => {handleMouseOutMechInput(mech_i)}}
                                                    />
                                                ))
                                            :
                                                Array.from({length:numMechs}).map ((_,mech_i) => (
                                                    <MechInput
                                                        key={`mech-input-${mech_i}`}
                                                        mechIndex={mech_i}
                                                        position={mechInitPositions[mech_i]}
                                                        program={programs[mech_i]}
                                                        pc={mechStates[mech_i].pc_next}
                                                        onPositionChange={(index, position) => {}}
                                                        onProgramChange={(index, program) => {}}
                                                        disabled = {animationState == 'Stop' ? false : true}
                                                        handleMouseOver={() => {handleMouseOverMechInput(mech_i)}}
                                                        handleMouseOut={() => {handleMouseOutMechInput(mech_i)}}
                                                    />
                                                ))
                                            }
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    {/* </div> */}


                    <div className={styles.grid_parent}>
                        <OperatorGridBg operators={operatorStates} highlighted={operatorInputHighlight}/>
                        {
                            Array.from({length:DIM}).map ((_,i) => ( // i is y
                                <div key={`row-${i}`} className={styles.grid_row}>
                                    {
                                        Array.from({length:DIM}).map ((_,j) => ( // j is x
                                            <Tooltip title={`${j},${i}`} disableInteractive arrow>
                                                <div>
                                                    <Unit
                                                        key={`unit-${j}-${i}`}
                                                        state={unitStates[j][i]}
                                                        handleMouseOver={() => handleMouseOver(j,i)}
                                                        handleMouseOut={() => handleMouseOut()}
                                                        mechHighlight={
                                                            (mechIndexHighlighted == -1) ? false :
                                                            (j == mechStates[mechIndexHighlighted].index.x) && (i == mechStates[mechIndexHighlighted].index.y) ? true : false
                                                        }
                                                        isSmall={false}
                                                    />
                                                </div>
                                            </Tooltip>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>

                    <div className={styles.delivered_atoms}>
                        <Delivery delivered={delivered} cost_accumulated={cost_accumulated}/>
                    </div>

                    <div className={styles.summary}>
                        <Summary frames={frames} n_cycles={N_CYCLES}/>
                    </div>

                    <div  className={styles.summary}>
                        <Leaderboard loadSolution={handleLoadSolutionClick}/>
                    </div>

                </main>

            </ThemeProvider>

        </div>
    )
}
