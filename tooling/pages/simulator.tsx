import MechState, {MechStatus} from '../src/types/MechState';
import AtomState, {AtomStatus, AtomType} from '../src/types/AtomState';
import Grid from '../src/types/Grid'
import BoardConfig from '../src/types/BoardConfig';
import Frame from '../src/types/Frame';

export function isIdenticalGrid (
    grid1 : Grid,
    grid2 : Grid
): boolean {
    return JSON.stringify(grid1) == JSON.stringify(grid2)
}

//
// a pure function that runs simulation for fixed cycles
//
export default function simulator(
    n_cycles : number,
    mechs : MechState[],
    atoms : AtomState[],
    instructionSets : string[][],
    boardConfig: BoardConfig, // including atom faucet, operator, atom sink - these don't change in frames
): Frame[] {

    // guardrail
    if (!boardConfig) {return []}

    // Note: when implementing this function in smart contract,
    // must implement config verification, particularly - verify the validity of operator placement

    //
    // Prepare the first frame
    //
    var grid_populated_bools : { [key: string] : boolean } = {}
    for (var i=0; i<boardConfig.dimension; i++){
        for (var j=0; j<boardConfig.dimension; j++){
            grid_populated_bools[JSON.stringify({x:i,y:j})] = false
        }
    }
    for (const atom of atoms) {
        grid_populated_bools[JSON.stringify(atom.index)] = true
    }
    const frame_init : Frame= {
        mechs: mechs,
        atoms: atoms,
        grid_populated_bools: grid_populated_bools,
        delivered_accumulated: []
    }

    //
    // Forward system by n_cycles, recording frames emitted; a frame carries all objects with their states i.e. frame == state screenshot
    //
    var frame_s: Frame[] = [frame_init]
    for (var i=0; i<n_cycles; i++) {
        //
        // Prepare instruction for each mech
        //
        var instruction_per_mech = []
        mechs.forEach((mech:MechState, mech_i:number) => {
            const instructionSet = instructionSets[mech_i]
            const instruction = instructionSet[i % instructionSet.length]
            instruction_per_mech.push (instruction)
        })
        // console.log(`cycle ${i}, instruction_per_mech ${JSON.stringify(instruction_per_mech)}`)

        // Run simulate_one_cycle()
        const last_frame = frame_s[frame_s.length-1]
        const new_frame: Frame = _simulate_one_cycle (
            instruction_per_mech,
            last_frame,
            boardConfig
        )
        // console.log('frame.atoms', i, ":", JSON.stringify(frame.atoms))

        // Record frame emitted
        frame_s.push(new_frame)
    }

    return frame_s
}

//
// a pure function that runs simulation for one cycle, according to instruction input
//
function _simulate_one_cycle (
    instruction_per_mech: string[],
    frame_curr: Frame, // {mechs, atoms, grid_populated_bools}
    boardConfig: BoardConfig
): Frame {
    //
    // Unpack frame
    //
    const mechs_curr = frame_curr.mechs // array of {'id':'mech..', 'index':{x:..,y:..}, 'status':'..', 'typ':'..'}
    const atoms_curr = frame_curr.atoms // array of {'id':'atom..', 'index':{x:..,y:..}, 'status':'..', 'typ':'..'}
    const grid_populated_bools = frame_curr.grid_populated_bools // mapping 'x..y..' => true/false

    //
    // Prepare mutable variable for this cycle pass
    //
    var mechs_new: MechState[] = []
    var atoms_new: AtomState[] = JSON.parse(JSON.stringify(atoms_curr)) // object cloning
    var grid_populated_bools_new: { [key: string] : boolean } = JSON.parse(JSON.stringify(grid_populated_bools)) // object cloning

    //
    // Iterate through atom faucets
    //
    for (const atom_faucet of boardConfig.atom_faucets) {
        if (grid_populated_bools_new[JSON.stringify(atom_faucet.index)] == false){
            const atom_new: AtomState= {
                id: `atom${atoms_new.length}`, typ: atom_faucet.typ, status: AtomStatus.FREE, index: atom_faucet.index, possessed_by: null
            }
            atoms_new.push (atom_new)
            grid_populated_bools_new[JSON.stringify(atom_faucet.index)] = true
        }
    }

    //
    // Iterate through mechs
    //
    // for (const mech of mechs_curr) {
    mechs_curr.map((mech: MechState, mech_i: number) => {
        const instruction = instruction_per_mech[mech_i]
        var mech_new = {id:mech.id, typ:mech.typ, index:mech.index, status:mech.status}

        console.log (`mech${mech_i} running ${instruction}`)

        if (instruction == 'D'){ // x-positive
            if (mech.index.x < boardConfig.dimension-1) {
                // move mech
                mech_new.index = {x:mech.index.x+1, y:mech.index.y}

                // move atom if possessed by this mech
                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.status == AtomStatus.POSSESSED && atom.possessed_by == mech.id){
                        var atom_new = theArray[i]
                        atom_new.index.x += 1
                        theArray[i] = atom_new
                    }
                });
            }
        }
        else if (instruction == 'A'){ // x-negative
            if (mech.index.x > 0) {
                // move mech
                mech_new.index = {x:mech.index.x-1, y:mech.index.y}

                // move atom if possessed by this mech
                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.status == AtomStatus.POSSESSED && atom.possessed_by == mech.id){
                        var atom_new = theArray[i]
                        atom_new.index.x -= 1
                        theArray[i] = atom_new
                    }
                });
            }
        }
        else if (instruction == 'S'){ // y-positive
            if (mech.index.y < boardConfig.dimension-1) {
                mech_new.index = {x:mech.index.x, y:mech.index.y+1}

                // move atom if possessed by this mech
                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.status == AtomStatus.POSSESSED && atom.possessed_by == mech.id){
                        var atom_new = theArray[i]
                        atom_new.index.y += 1
                        theArray[i] = atom_new
                    }
                });
            }
        }
        else if (instruction == 'W'){ // y-negative
            if (mech.index.y > 0) {
                mech_new.index = {x:mech.index.x, y:mech.index.y-1}

                // move atom if possessed by this mech
                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.status == AtomStatus.POSSESSED && atom.possessed_by == mech.id){
                        var atom_new = theArray[i]
                        atom_new.index.y -= 1
                        theArray[i] = atom_new
                    }
                });
            }
        }
        else if (instruction == 'Z'){ // GET
            if (
                    (mech.status == MechStatus.OPEN) &&
                    (grid_populated_bools_new[JSON.stringify(mech.index)] == true) // atom available for grab here
            ) {
                mech_new.status = MechStatus.CLOSE
                grid_populated_bools_new[JSON.stringify(mech.index)] = false

                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if ( isIdenticalGrid(atom.index, mech.index) ){
                        var atom_new = theArray[i]
                        atom_new.status = AtomStatus.POSSESSED
                        atom_new.possessed_by = mech.id
                        theArray[i] = atom_new
                    }
                });
            }
        }
        else if (instruction == 'X'){ // PUT
            if (
                    (mech.status == MechStatus.CLOSE) &&
                    (grid_populated_bools_new[JSON.stringify(mech.index)] == false) // can drop atom here
            ) {
                mech_new.status = MechStatus.OPEN
                grid_populated_bools_new[JSON.stringify(mech.index)] = true

                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.possessed_by == mech.id){
                        var atom_new = theArray[i]
                        atom_new.status = AtomStatus.FREE
                        atom_new.possessed_by = null
                        theArray[i] = atom_new
                    }
                });
            }
        }

        mechs_new.push (mech_new)
    })

    //
    // Iterate through operators
    //
    for (const binary_operator of boardConfig.binary_operators){
        if ( // both a and b are occupied with atoms, and z is empty
            grid_populated_bools_new[JSON.stringify(binary_operator.a)] &&
            grid_populated_bools_new[JSON.stringify(binary_operator.b)] &&
            !grid_populated_bools_new[JSON.stringify(binary_operator.z)]
        ){
            // TODO create abstraction for representing formula
            // find the type of atoms occupying the operand grids - TODO improve implementation
            var atom_type_a: AtomType
            var atom_type_b: AtomType
            var atom_i_a: number
            var atom_i_b: number
            atoms_new.forEach((atom: AtomState, atom_i: number) => {
                if (isIdenticalGrid(atom.index, binary_operator.a)) {
                    atom_type_a = atom.typ
                    atom_i_a = atom_i
                }
                else if (isIdenticalGrid(atom.index, binary_operator.b)) {
                    atom_type_b = atom.typ
                    atom_i_b = atom_i
                }
            })

            // check for formula match
            if (atom_type_a == AtomType.VANILLA && atom_type_b == AtomType.VANILLA){
                // consume two vanilla atoms to produce one hazelnut atom
                grid_populated_bools_new[JSON.stringify(binary_operator.a)] = false
                grid_populated_bools_new[JSON.stringify(binary_operator.b)] = false
                atoms_new[atom_i_a].status = AtomStatus.CONSUMED
                atoms_new[atom_i_b].status = AtomStatus.CONSUMED
                grid_populated_bools_new[JSON.stringify(binary_operator.z)] = true
                let atom_new_hazelnut: AtomState = {
                    id: `atom${atoms_new.length}`,
                    typ: AtomType.HAZELNUT,
                    status: AtomStatus.FREE,
                    index: binary_operator.z,
                    possessed_by: null
                }
                atoms_new.push(atom_new_hazelnut)
            }
        }
    }

    //
    // Iterate through atom sinks
    //
    var delivered_accumulated_new: AtomType[] = JSON.parse(JSON.stringify(frame_curr.delivered_accumulated))
    for (const atom_sink of boardConfig.atom_sinks) {
        // iterate through atoms, see if a 'free' one is lying at this sink
        atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
            if ( isIdenticalGrid(atom.index, atom_sink.index) && atom.status==AtomStatus.FREE ){
                var atom_new = theArray[i]
                atom_new.status = AtomStatus.DELIVERED
                atom_new.possessed_by = null
                theArray[i] = atom_new

                delivered_accumulated_new.push (atom_new.typ)

                // mark the grid not-populated
                grid_populated_bools_new[JSON.stringify(atom_sink.index)] = false
            }
        });
    }

    //
    // Pack a new frame and return
    //
    const frame_new: Frame = {
        mechs: mechs_new,
        atoms: atoms_new,
        grid_populated_bools: grid_populated_bools_new,
        delivered_accumulated: delivered_accumulated_new
    }
    return frame_new
}

// Note:
// atom source replenish
// atom operator churn
// machine churn
// housekeeping
