import MechState from "./MechState";
import AtomState from "./AtomState";

export default interface Frame {
    mechs: MechState[]
    atoms: AtomState[]
    grid_populated_bools: { [key: string] : boolean }
    delivered_accumulated: string[]
}
