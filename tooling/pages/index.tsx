import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState, useEffect, useRef} from 'react';
import simulator from "./simulator"
import MechState, { MechStatus } from '../src/types/MechState';
import AtomState, { AtomStatus } from '../src/types/AtomState';
import AtomFaucetState from '../src/types/AtomFaucetState';
import AtomSinkState from '../src/types/AtomSinkState';
import BoardConfig from '../src/types/BoardConfig';
import Frame from '../src/types/Frame';
import Unit from './unit';
import UnitState, {BgStatus, BorderStatus} from '../src/types/UnitState';

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
    const [loop, setLoop] = useState<NodeJS.Timer>();
    const [unitStates, setUnitStates] = useState<UnitState[][]>(unitStatesInit); // UnitState[x][y]

    // React reference
    const animationIndexRef = useRef<number>();
    const atomInitStatesRef = useRef<AtomState[]>();
    const mechInitStatesRef = useRef<MechState[]>();
    const atomStatesRef = useRef<AtomState[]>();
    const mechStatesRef = useRef<MechState[]>();
    const framesRef = useRef([]);

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
            const frames = simulator (
                20, // n_cycles,
                mechInitStatesRef.current,
                atomInitStatesRef.current,
                instructions, // instructions
                boardConfig,
            )
            framesRef.current = frames

            frames.forEach((f:Frame,i:number) => {
                const s = f.mechs.map(function(v){return JSON.stringify(v)}).join('\n')
                console.log(i, s)
            })
            console.log('delivered_accumulated at the last frame:', frames[frames.length-1].delivered_accumulated)

            // Begin animation
            setAnimationState ('Run')
            setLoop(
                setInterval(() => {
                    simulationLoop()
                }, ANIM_FRAME_LATENCY)
            );
            // console.log('Running with instruction:', instructions)
        }

        // Stop and reset simulation
        else {
            setAnimationState ('Stop')
            clearInterval (loop);

            // set react states
            setUnitStates ((prevStates) => {
                // cache react states
                let newUnitStates = JSON.parse(JSON.stringify(prevStates)) // duplicate

                // clear visual
                newUnitStates = clearVisualForStates (newUnitStates)

                // reset scene to initial state
                newUnitStates = resetSceneForStates (newUnitStates)
                return newUnitStates
            })
        }
    }

    function setMechInitX (x_str: string){

        // clear visual first
        // document.querySelector(`#cell-${mechStatesRef.current[0].index.x}-${mechStatesRef.current[0].index.y}`).classList.remove(`mech_${mechStatesRef.current[0].status}`);
        setUnitStates((prevStates) => {
            let newUnitStates: UnitState[][] = JSON.parse(JSON.stringify(prevStates)) // duplicate
            newUnitStates[mechStatesRef.current[0].index.x][mechStatesRef.current[0].index.y].border_status = BorderStatus.EMPTY
            return newUnitStates
        })

        if (!x_str) return;
        const x = parseInt(x_str)
        if (x < DIM && x >= 0) {

            mechInitStatesRef.current[0].index.x = x;

            setUnitStates ((prevStates) => {
                let newUnitStates = JSON.parse(JSON.stringify(prevStates)) // duplicate
                for (const mech of mechInitStatesRef.current) {
                    newUnitStates = setMechVisualForStates (mech, newUnitStates)
                }
                return newUnitStates
            })
        }
    }
    function setMechInitY (y_str: string){

        // clear visual first
        // document.querySelector(`#cell-${mechStatesRef.current[0].index.x}-${mechStatesRef.current[0].index.y}`).classList.remove(`mech_${mechStatesRef.current[0].status}`);
        setUnitStates((prevStates) => {
            let newUnitStates: UnitState[][] = JSON.parse(JSON.stringify(prevStates)) // duplicate
            newUnitStates[mechStatesRef.current[0].index.x][mechStatesRef.current[0].index.y].border_status = BorderStatus.EMPTY
            return newUnitStates
        })

        if (!y_str) return;
        const y = parseInt(y_str)
        if (y < DIM && y >= 0) {

            mechInitStatesRef.current[0].index.y = y;

            setUnitStates ((prevStates) => {
                let newUnitStates = JSON.parse(JSON.stringify(prevStates)) // duplicate
                for (const mech of mechInitStatesRef.current) {
                    newUnitStates = setMechVisualForStates (mech, newUnitStates)
                }
                return newUnitStates
            })
        }
    }

    // Initialize scene
    useEffect(() => {
        setUnitStates ((prevStates) => {
            let newUnitStates = JSON.parse(JSON.stringify(prevStates)) // duplicate
            newUnitStates = resetSceneForStates (newUnitStates)
            return newUnitStates
        })
    }, [])

    function resetSceneForStates (states: UnitState[][]){
        // set reference values
        animationIndexRef.current = 0
        atomInitStatesRef.current = ATOM_INIT_XY.map(
            function (xy,i) {
                return {status:AtomStatus.FREE, index:{x:xy.x, y:xy.y}, id:`atom${i}`, typ:'vanilla', possessed_by:null} as AtomState
            }
        )
        mechInitStatesRef.current = [
            {status:MechStatus.OPEN, index:{x:MECH_INIT_X, y:MECH_INIT_Y}, id:'mech0', typ:'singleton'}
        ] as MechState[]
        atomStatesRef.current = atomInitStatesRef.current;
        mechStatesRef.current = mechInitStatesRef.current;
        (document.getElementById("input-mech-init-x") as HTMLInputElement).value = MECH_INIT_X.toString();
        (document.getElementById("input-mech-init-y") as HTMLInputElement).value = MECH_INIT_Y.toString();

        // draw to scene
        let newStates = JSON.parse(JSON.stringify(states)) // duplicate
        newStates = setVisualForStates (newStates)

        return newStates
    }

    function simulationLoop (){
        // update react states
        setUnitStates ((prevStates) => {
            // cache current react states as mutable variable for this frame pass
            let newUnitStates = JSON.parse(JSON.stringify(prevStates))

            // clear current visual
            newUnitStates = clearVisualForStates (newUnitStates)

            // update refs from a new frame
            updateRefs ()

            // set new visual
            newUnitStates = setVisualForStates (newUnitStates)

            // housekeeping 
            // FIXME: I think this gets called at the wrong time
            updateAnimationIndex ()

            return newUnitStates
        })
    }

    function updateRefs (){
        const frame = framesRef.current [animationIndexRef.current]

        atomStatesRef.current = frame.atoms
        mechStatesRef.current = frame.mechs
    }

    function clearVisualForStates (states: UnitState[][]){
        let newStates = JSON.parse(JSON.stringify(states)) // duplicate

        for (const mech of mechStatesRef.current) {
            newStates[mech.index.x][mech.index.y].border_status = BorderStatus.EMPTY
        }
        for (const atom of atomStatesRef.current) {
            newStates[atom.index.x][atom.index.y].bg_status = BgStatus.EMPTY
        }

        return newStates
    }

    function setVisualForStates (states: UnitState[][]){
        let newStates = JSON.parse(JSON.stringify(states)) // duplicate

        for (const atom of atomStatesRef.current) {
            newStates = setAtomVisualForStates (atom, newStates)
        }
        for (const mech of mechStatesRef.current) {
            newStates = setMechVisualForStates (mech, newStates)
        }

        return newStates
    }

    function updateAnimationIndex (){
        if (animationIndexRef.current == framesRef.current.length - 1) {
            animationIndexRef.current = 0
        }
        else {
            animationIndexRef.current += 1
        }
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
