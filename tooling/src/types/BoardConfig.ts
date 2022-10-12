import AtomFaucetState from './AtomFaucetState'
import AtomSinkState from './AtomSinkState'

export default interface BoardConfig {
    dimension: number
    atom_faucets: AtomFaucetState[]
    atom_sinks: AtomSinkState[]
}
