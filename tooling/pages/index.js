import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState, useEffect, useRef} from 'react';
import simulator from "./simulator"

export default function Home() {

    // Constants
    const INIT_PROGRAM = 'XP,XP,GET,XN,XN,PUT'
    const MECH_INIT_X = 3
    const MECH_INIT_Y = 3
    const ATOM_INIT_X = 6
    const ATOM_INIT_Y = 3
    const DIM = 20

    // React states
    const [program, setProgram] = useState(INIT_PROGRAM);
    const [instructions, setInstructions] = useState([]);
    const [animationState, setAnimationState] = useState ('Stop');
    const [loop, setLoop] = useState();

    // React reference
    const animationIndexRef = useRef();
    const atomStatesRef = useRef([]); // contain index and status; atom status = {'free', 'possessed'}
    const mechStatesRef = useRef([]); // contain index and status; mech status = {'open', 'closed'}
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
            const mechs = mechStatesRef.current
            const atoms = [{status:'free', index:{x:ATOM_INIT_X, y:ATOM_INIT_Y}, id:'atom0', typ:'vanilla', possessed_by:null}]
            const constants = {DIM:DIM}
            console.log("mechs input:", mechs)
            console.log("atoms input:", atoms) // why does this line not print index:{x:ATOM_INIT_X, y:ATOM_INIT_Y} as assigned on L41??

            // Run simulation to get all frames and set to reference
            const frames = simulator (
                10, // n_cycles,
                mechs,
                atoms,
                instructions, // instructions
                constants,
            )
            framesRef.current = frames
            // console.log('frames:',frames)

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
        if (x < DIM & x >= 0) {

            mechStatesRef.current[0].index.x = x;

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
        if (y < DIM & y >= 0) {

            mechStatesRef.current[0].index.y = y;

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
        atomStatesRef.current = [
            {status:'free', index:{x:ATOM_INIT_X, y:ATOM_INIT_Y}, id:'atom0', typ:'vanilla', possessed_by:null}
        ]
        mechStatesRef.current = [
            {status:'open', index:{x:MECH_INIT_X, y:MECH_INIT_Y}, id:'mech0', typ:'singleton'}
        ]
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

    // // Timer for looping
    // useEffect(() => {
    //         if (animationState == 'Run') {
    //             setLoop(
    //                 setInterval(() => {simulationLoop()}, 300)
    //             );
    //         }
    //         else {
    //             clearInterval (loop);
    //         }
    //     }, [animationState]
    // )

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
        // console.log('running frame index:', animationIndexRef.current)
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
                                        (i==3) & (j==3) ?
                                        <div id={`cell-${j}-${i}`} key={`cell-${j}-${i}`} className={styles.card} onClick={() => handleClick(i,j)}>
                                            {/* {i},{j} */}·
                                        </div>
                                        :
                                        <div id={`cell-${j}-${i}`} key={`cell-${j}-${i}`} className={styles.card} onClick={() => handleClick(i,j)}>
                                            {/* {i},{j} */}·
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
