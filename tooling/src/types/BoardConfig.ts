import AtomFaucetState from './AtomFaucetState'
import AtomSinkState from './AtomSinkState'
import Operator from './Operator'

export default interface BoardConfig {
    dimension: number
    atom_faucets: AtomFaucetState[]
    atom_sinks: AtomSinkState[]
    operators: Operator[]
}
