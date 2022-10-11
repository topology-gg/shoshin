import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState, useEffect, useRef} from 'react';
import simulator from "./simulator"
import MechState from '../src/types/MechState';

export default function Home() {

    // Constants
    const INIT_PROGRAM = 'XP,XP,GET,XN,XN,PUT'
    const MECH_INIT_X = 3
    const MECH_INIT_Y = 3
    const ATOM_INIT_XY = [{x:6, y:3}]
    const DIM = 20

    // React states
    const [program, setProgram] = useState(INIT_PROGRAM);
    const [instructions, setInstructions] = useState([]);
    const [animationState, setAnimationState] = useState ('Stop');
    const [loop, setLoop] = useState<NodeJS.Timer>();

    // React reference
    const animationIndexRef = useRef<number>();
    const atomInitStatesRef = useRef([]); // contain index and status; atom status = {'free', 'possessed'}
    const mechInitStatesRef = useRef([]); // contain index and status; mech status = {'open', 'closed'}
    const atomStatesRef = useRef([]); // contain index and status; atom status = {'free', 'possessed'}
    const mechStatesRef = useRef<MechState[]>([]); // contain index and status; mech status = {'open', 'closed'}
    const framesRef = useRef([]);

    // Handle click event
    function handleClick (){
        // Run simulation
        if (animationState == 'Stop') {

            // Parse program into array of instructions and store to react state
            const instructions = program.split(',')
            if (instructions.length == 0) {return;}
            setInstructions (instructions)

            // Prepare input
            const constants = {DIM:DIM}

            // Run simulation to get all frames and set to reference
            const frames = simulator (
                20, // n_cycles,
                mechInitStatesRef.current,
                atomInitStatesRef.current,
                instructions, // instructions
                constants,
            )
            framesRef.current = frames

            // Begin animation
            setAnimationState ('Run')
            setLoop(
                setInterval(() => {simulationLoop()}, 300)
            );
            // console.log('Running with instruction:', instructions)
        }

        // Stop and reset simulation
        else {
            setAnimationState ('Stop')
            clearInterval (loop);

            for (const mech of mechStatesRef.current) {
                document.querySelector(`#cell-${mech.index.x}-${mech.index.y}`).classList.remove(`mech_${mech.status}`);
            }

            for (const atom of atomStatesRef.current) {
                document.querySelector(`#cell-${atom.index.x}-${atom.index.y}`).classList.remove(`atom_${atom.status}`);
            }

            reset_scene ()
        }
    }

    function setMechInitX (x_str){

        // clear visual first
        document.querySelector(`#cell-${mechStatesRef.current[0].index.x}-${mechStatesRef.current[0].index.y}`).classList.remove(`mech_${mechStatesRef.current[0].status}`);

        if (!x_str) return;
        const x = parseInt(x_str)
        if (x < DIM && x >= 0) {

            mechInitStatesRef.current[0].index.x = x;

            for (const mech of mechStatesRef.current) {
                document.querySelector(`#cell-${mech.index.x}-${mech.index.y}`).classList.add(`mech_${mech.status}`);
            }
        }
    }
    function setMechInitY (y_str){

        // clear visual first
        document.querySelector(`#cell-${mechStatesRef.current[0].index.x}-${mechStatesRef.current[0].index.y}`).classList.remove(`mech_${mechStatesRef.current[0].status}`);

        if (!y_str) return;
        const y = parseInt(y_str)
        if (y < DIM && y >= 0) {

            mechInitStatesRef.current[0].index.y = y;

            for (const mech of mechStatesRef.current) {
                document.querySelector(`#cell-${mech.index.x}-${mech.index.y}`).classList.add(`mech_${mech.status}`);
            }
        }
    }

    // Initialize scene
    useEffect(() => {
        reset_scene ()
    }, [])

    function reset_scene (){
        // set reference values
        animationIndexRef.current = 0
        atomInitStatesRef.current = ATOM_INIT_XY.map(
            function (xy,i) {
                return {status:'free', index:{x:xy.x, y:xy.y}, id:`atom${i}`, typ:'vanilla', possessed_by:null}
            }
        )
        mechInitStatesRef.current = [
            {status:'open', index:{x:MECH_INIT_X, y:MECH_INIT_Y}, id:'mech0', typ:'singleton'}
        ]
        atomStatesRef.current = atomInitStatesRef.current
        mechStatesRef.current = mechInitStatesRef.current
        document.getElementById("input-mech-init-x").value = MECH_INIT_X
        document.getElementById("input-mech-init-y").value = MECH_INIT_Y

        // draw to scene
        for (const atom of atomStatesRef.current) {
            document.querySelector(`#cell-${atom.index.x}-${atom.index.y}`).classList.add(`atom_${atom.status}`);
        }
        for (const mech of mechStatesRef.current) {
            document.querySelector(`#cell-${mech.index.x}-${mech.index.y}`).classList.add(`mech_${mech.status}`);
        }
    }

    function simulationLoop (){
        // clear current visual
        clearVisual ()

        // update refs from a new frame
        updateRefs ()

        // set new visual
        setVisual ()

        // housekeeping
        updateAnimationIndex ()
    }

    function updateRefs (){
        const frame = framesRef.current [animationIndexRef.current]

        atomStatesRef.current = frame.atoms
        mechStatesRef.current = frame.mechs
    }

    function clearVisual (){
        for (const atom of atomStatesRef.current) {
            document.querySelector(`#cell-${atom.index.x}-${atom.index.y}`).classList.remove(`atom_${atom.status}`);
        }
        for (const mech of mechStatesRef.current) {
            document.querySelector(`#cell-${mech.index.x}-${mech.index.y}`).classList.remove(`mech_${mech.status}`);
        }
    }

    function setVisual (){
        for (const atom of atomStatesRef.current) {
            document.querySelector(`#cell-${atomStatesRef.current[0].index.x}-${atomStatesRef.current[0].index.y}`).classList.add(`atom_${atom.status}`);
        }
        for (const mech of mechStatesRef.current) {
            document.querySelector(`#cell-${mechStatesRef.current[0].index.x}-${mechStatesRef.current[0].index.y}`).classList.add(`mech_${mechStatesRef.current[0].status}`);
        }
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
                        Array.from({length:DIM}).map ((_,i) => (
                            <div key={`row-${i}`} className={styles.grid_row}>
                                {
                                    Array.from({length:DIM}).map ((_,j) => (
                                        <div id={`cell-${j}-${i}`} key={`cell-${j}-${i}`} className={styles.card} onClick={() => handleClick()}>
                                            ·
                                        </div>
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
