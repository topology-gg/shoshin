import Grid from './Grid'
import { AtomType } from './AtomState'

export default interface AtomFaucetState {
  id: string
  typ: AtomType
  index: Grid
}
