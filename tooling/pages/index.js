import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState, useEffect, useRef} from 'react';

export default function Home() {

    // React states
    const INIT_PROGRAM = 'LN,_,LN,GET,ST,_,ST,PUT'
    const [program, setProgram] = useState(INIT_PROGRAM);
    const [instructions, setInstructions] = useState([]);
    const [animationState, setAnimationState] = useState ('Stop');
    const [loop, setLoop] = useState();

    // React reference
    const atomIndexRef = useRef([3,6]);
    const gripIndexRef = useRef([3,4]);
    const animationIndexRef = useRef(0);
    const gripStateRef = useRef('open'); // open, close
    const atomStateRef = useRef('free'); // free, possessed

    // Handle click event
    function handleClick (){
        // Run simulation
        if (animationState == 'Stop') {
            // Parse program into array of instructions and store to react state
            const instr_arr = program.split(',')
            setInstructions (instr_arr)
            if (instr_arr.length > 0) {
                setAnimationState ('Run')
                console.log('Running with instruction:', instr_arr)
            }
        }

        // Stop and reset simulation
        else {
            setAnimationState ('Stop')
            document.querySelector(`#cell-${gripIndexRef.current[0]}-${gripIndexRef.current[1]}`).classList.remove(`grip_${gripStateRef.current}`);
            document.querySelector(`#cell-${atomIndexRef.current[0]}-${atomIndexRef.current[1]}`).classList.remove('atom');
            document.querySelector("#cell-3-3").classList.remove('machine');

            reset_scene ()
        }
    }

    // Initialize scene
    useEffect(() => {
        reset_scene ()
    }, [])

    function reset_scene (){
        animationIndexRef.current = 0
        gripIndexRef.current = [3,4]
        atomIndexRef.current = [3,6]
        document.querySelector("#cell-3-3").classList.add('machine');
        document.querySelector(`#cell-3-4`).classList.add('grip_open');
        document.querySelector(`#cell-3-6`).classList.add('atom');
    }

    // Timer for looping
    useEffect(() => {
            if (animationState == 'Run') {
                setLoop(
                    setInterval(() => {simulationLoop()}, 300)
                );
            }
            else {
                clearInterval (loop);
            }
        }, [animationState]
    )

    function simulationLoop (){
        // atom source replenish

        // atom operator churn

        // machine churn
        updateGrip ()
    }

    function updateGrip (){

        // save current grip index
        // console.log('running animationIndex:', animationIndexRef.current, 'gripIndex =', current_grip)
        const current_grip = gripIndexRef.current
        document.querySelector(`#cell-${gripIndexRef.current[0]}-${gripIndexRef.current[1]}`).classList.remove(`grip_${gripStateRef.current}`);
        document.querySelector(`#cell-${atomIndexRef.current[0]}-${atomIndexRef.current[1]}`).classList.remove('atom');

        // set new grip style by decoding current instruction
        // note: should refactor style-setting away from instruction-decode
        const inst = instructions[animationIndexRef.current]
        // console.log ('running instruction:', inst)
        if (inst == 'LN' && current_grip[1] < 6) {
            gripIndexRef.current = [current_grip[0], current_grip[1]+1]
            if (atomStateRef.current == 'possessed') {
                atomIndexRef.current = gripIndexRef.current
            }
        }
        else if (inst == 'ST' && current_grip[1] > 0) {
            gripIndexRef.current = [current_grip[0], current_grip[1]-1]
            if (atomStateRef.current == 'possessed') {
                atomIndexRef.current = gripIndexRef.current
            }
        }
        else if (inst == 'GET') {
            gripStateRef.current = 'close'
            console.log(gripIndexRef.current, atomIndexRef.current)
            if (isIdenticalIndex(gripIndexRef.current,atomIndexRef.current)) {
                atomStateRef.current = 'possessed'
            }
        }
        else if (inst == 'PUT') {
            gripStateRef.current = 'open'
            if (isIdenticalIndex(gripIndexRef.current,atomIndexRef.current)) {
                atomStateRef.current = 'free'
            }
        }

        // Update visual
        document.querySelector(`#cell-${gripIndexRef.current[0]}-${gripIndexRef.current[1]}`).classList.add(`grip_${gripStateRef.current}`);
        document.querySelector(`#cell-${atomIndexRef.current[0]}-${atomIndexRef.current[1]}`).classList.add('atom');

        updateAnimationIndex ()
        return;
    }

    function updateAnimationIndex (){
        if (animationIndexRef.current == instructions.length - 1) {
            animationIndexRef.current = 0
        }
        else {
            animationIndexRef.current += 1
        }
    }

    function isIdenticalIndex (ind1, ind2){
        return JSON.stringify(ind1) == JSON.stringify(ind2)
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
                <h1 className={styles.title}>
                    MovyMovy
                </h1>

                <p className={styles.description}>
                    <input
                        className={styles.program}
                        onChange={event => {setProgram(event.target.value)}}
                        defaultValue={INIT_PROGRAM}
                        style={{width:'300px'}}
                    ></input>
                    <button onClick={handleClick}>{animationState == 'Stop' ? 'Run' : 'Stop'}</button>
                </p>

                <div className={styles.grid_parent}>
                    {
                        Array.from({length:7}).map ((_,i) => (
                            <div key={`row-${i}`} className={styles.grid_row}>
                                {
                                    Array.from({length:7}).map ((_,j) => (
                                        (i==3) & (j==3) ?
                                        <div id={`cell-${i}-${j}`} key={`cell-${i}-${j}`} className={styles.card} onClick={() => handleClick(i,j)}>
                                            {/* {i},{j} */}.
                                        </div>
                                        :
                                        <div id={`cell-${i}-${j}`} key={`cell-${i}-${j}`} className={styles.card} onClick={() => handleClick(i,j)}>
                                            {/* {i},{j} */}.
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
