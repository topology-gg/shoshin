import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState, useEffect, useRef} from 'react';

export default function Home() {

    // Constants
    const INIT_PROGRAM = 'XP,XP,GET,XN,XN,PUT'
    const MECH_INIT_X = 3
    const MECH_INIT_Y = 3
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
            document.querySelector(`#cell-${mechStatesRef.current[0].index.x}-${mechStatesRef.current[0].index.y}`).classList.remove(`mech_${mechStatesRef.current[0].status}`);
            document.querySelector(`#cell-${atomStatesRef.current[0].index.x}-${atomStatesRef.current[0].index.x}`).classList.remove('atom');

            reset_scene ()
        }
    }

    function setMechInitX (x_str){
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
        document.querySelector(`#cell-${mechStatesRef.current[0].index.x}-${mechStatesRef.current[0].index.y}`).classList.remove(`mech_${mechStatesRef.current[0].status}`);

        if (!y_str) return;
        const y = parseInt(y_str)
        if (y < DIM & y >= 0) {

            mechStatesRef.current[0].index.y = y;

            for (const mech of mechStatesRef.current) {
                console.log(mech.index.x, mech.index.y)
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
            {status:'free', index:{x:6, y:3}}
        ]
        mechStatesRef.current = [
            {status:'open', index:{x:MECH_INIT_X, y:MECH_INIT_Y}}
        ]
        document.getElementById("input-mech-init-x").value = MECH_INIT_X
        document.getElementById("input-mech-init-y").value = MECH_INIT_Y

        // draw to scene
        for (const atom of atomStatesRef.current) {
            document.querySelector(`#cell-${atom.index.x}-${atom.index.y}`).classList.add('atom');
        }
        for (const mech of mechStatesRef.current) {
            document.querySelector(`#cell-${mech.index.x}-${mech.index.y}`).classList.add(`mech_${mech.status}`);
        }
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
        updateMech ()

        // housekeeping
        updateAnimationIndex ()
    }

    function updateMech (){

        // Decode instruction; return if no-op
        const inst = instructions[animationIndexRef.current]
        if (inst == '_') return;

        // Save current mech index and clear visual
        const mech = mechStatesRef.current[0]
        const atom = atomStatesRef.current[0]
        document.querySelector(`#cell-${mech.index.x}-${mech.index.y}`).classList.remove(`mech_${mech.status}`);
        document.querySelector(`#cell-${atom.index.x}-${atom.index.y}`).classList.remove('atom');

        // Compute new mech
        if (inst == 'XP' && mech.index.x < DIM) { // X += 1
            mechStatesRef.current[0] = {index:{x:mech.index.x+1, y:mech.index.y}, status:mech.status}

            if (atom.status == 'possessed') {
                atomStatesRef.current[0] = {index:mechStatesRef.current[0].index, status:atom.status}
            }
        }
        else if (inst == 'XN' && mech.index.x > 0) { // X -= 1
            mechStatesRef.current[0] = {index:{x:mech.index.x-1, y:mech.index.y}, status:mech.status}

            if (atom.status == 'possessed') {
                atomStatesRef.current[0] = {index:mechStatesRef.current[0].index, status:atom.status}
            }
        }
        else if (inst == 'GET' && mech.status == 'open') { // pick up atom if available in grid
            mechStatesRef.current[0] = {index:mech.index, status:'close'}
            if (isIdenticalIndex(mech.index, atom.index)) {
                atomStatesRef.current[0] = {index:atom.index, status:'possessed'}
            }
        }
        else if (inst == 'PUT' && mech.status == 'close') { // drop atom if currently possessing
            mechStatesRef.current[0] = {index:mech.index, status:'open'}
            if (isIdenticalIndex(mech.index, atom.index)) {
                atomStatesRef.current[0] = {index:atom.index, status:'free'}
            }
        }

        // Update visual
        document.querySelector(`#cell-${mechStatesRef.current[0].index.x}-${mechStatesRef.current[0].index.y}`).classList.add(`mech_${mechStatesRef.current[0].status}`);
        document.querySelector(`#cell-${atomStatesRef.current[0].index.x}-${atomStatesRef.current[0].index.y}`).classList.add('atom');

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

                    <button onClick={handleClick}>{animationState == 'Stop' ? 'Run' : 'Stop'}</button>

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
