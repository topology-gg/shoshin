
//
// a pure function that runs simulation for fixed cycles
//
export default function simulator(
    n_cycles,
    mechs,
    atoms,
    instructions,
    constants,
    // operators
    // atom faucet
    // atom sink
) {

    //
    // Prepare the first frame
    //
    var grid_populated_bools = {}
    for (var i=0; i<constants.DIM; i++){
        for (var j=0; j<constants.DIM; j++){
            grid_populated_bools[`x${i}y${j}`] = false
        }
    }
    for (const atom of atoms) {
        grid_populated_bools[`x${atom.index.x}y${atom.index.y}`] = true
    }
    const frame_init = {
        mechs: mechs,
        atoms: atoms,
        grid_populated_bools: grid_populated_bools
    };

    //
    // Forward system by n_cycles, recording frames emitted; a frame carries all objects with their states i.e. frame == state screenshot
    //
    var frame_s = [frame_init]
    for (var i=0; i<n_cycles; i++) {
        //
        // Prepare instruction for each mech
        //
        const instr = instructions[i % instructions.length];
        var instruction_per_mech = {}
        for (const mech of mechs){
            instruction_per_mech[mech.id] = instr // TODO diff mechs would have diff instructions
        }

        // Run simulate_one_cycle()
        const last_frame = frame_s[frame_s.length-1]
        const new_frame = _simulate_one_cycle (
            instruction_per_mech,
            last_frame,
            constants
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
    instruction_per_mech, // mapping 'mech..' => '..' (instruction string)
    frame_curr, // {mechs, atoms, grid_populated_bools}
    constants
) {
    //
    // Unpack frame
    //
    const mechs_curr = frame_curr.mechs // array of {'id':'mech..', 'index':{x:..,y:..}, 'status':'..', 'typ':'..'}
    const atoms_curr = frame_curr.atoms // array of {'id':'atom..', 'index':{x:..,y:..}, 'status':'..', 'typ':'..'}
    const grid_populated_bools = frame_curr.grid_populated_bools // mapping 'x..y..' => true/false

    //
    // Iterate through each mechs
    //
    var mechs_new = []
    var atoms_new = JSON.parse(JSON.stringify(atoms_curr)) // object cloning
    var grid_populated_bools_new = JSON.parse(JSON.stringify(grid_populated_bools)) // object cloning

    for (const mech of mechs_curr) {
        const instruction = instruction_per_mech[mech.id]

        var mech_new = {id:mech.id, typ:mech.typ, index:mech.index, status:mech.status}
        if (instruction == 'XP'){
            if (mech.index.x < constants.DIM) {
                // move mech
                mech_new.index = {x:mech.index.x+1, y:mech.index.y}

                // move atom if possessed by this mech
                atoms_new.forEach(function (atom, i, theArray) {
                    if (atom.status == 'possessed' && atom.possessed_by == mech.id){
                        var atom_new = theArray[i]
                        atom_new.index.x += 1
                        theArray[i] = atom_new
                    }
                });
            }
        }
        else if (instruction == 'XN'){
            if (mech.index.x > 0) {
                // move mech
                mech_new.index = {x:mech.index.x-1, y:mech.index.y}

                // move atom if possessed by this mech
                atoms_new.forEach(function (atom, i, theArray) {
                    if (atom.status == 'possessed' && atom.possessed_by == mech.id){
                        var atom_new = theArray[i]
                        atom_new.index.x -= 1
                        theArray[i] = atom_new
                    }
                });
            }
        }
        else if (instruction == 'YP'){
            if (mech.index.y < DIM) {
                mech_new.index = {x:mech.index.x, y:mech.index.y+1}
                // TODO: move atom if possessed
            }
        }
        else if (instruction == 'YN'){
            if (mech.index.y > 0) {
                mech_new.index = {x:mech.index.x, y:mech.index.y-1}
                // TODO: move atom if possessed
            }
        }
        else if (instruction == 'GET'){
            if (
                    (mech.status == 'open') &&
                    (grid_populated_bools[`x${mech.index.x}y${mech.index.y}`] == true) // atom available for grab here
            ) {
                mech_new.status = 'close'
                grid_populated_bools_new[`x${mech.index.x}y${mech.index.y}`] = false

                atoms_new.forEach(function (atom, i, theArray) {
                    if ( isIdenticalObj(atom.index, mech.index) ){
                        var atom_new = theArray[i]
                        atom_new.status = 'possessed'
                        atom_new.possessed_by = mech.id
                        theArray[i] = atom_new
                    }
                });
            }
        }
        else if (instruction == 'PUT'){
            if (
                    (mech.status=='close') &&
                    (grid_populated_bools[`x${mech.index.x}y${mech.index.y}`] == false) // can drop atom here
            ) {
                mech_new.status = 'open'
                grid_populated_bools_new[`x${mech.index.x}y${mech.index.y}`] = true

                atoms_new.forEach(function (atom, i, theArray) {
                    if (atom.possessed_by == mech.id){
                        var atom_new = theArray[i]
                        atom_new.status = 'free'
                        atom_new.possessed_by = null
                        theArray[i] = atom_new
                    }
                });
            }
        }

        mechs_new.push (mech_new)
    }

    //
    // Pack a new frame and return
    //
    const frame_new = {
        mechs: mechs_new,
        atoms: atoms_new,
        grid_populated_bools: grid_populated_bools_new
    }
    return frame_new
}

function isIdenticalObj (obj1, obj2){
    return JSON.stringify(obj1) == JSON.stringify(obj2)
}

// Note:
// atom source replenish
// atom operator churn
// machine churn
// housekeeping
