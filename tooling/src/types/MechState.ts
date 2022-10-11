import Grid from './Grid'

export enum MechStatus {
  CLOSE = 'close',
  OPEN = 'open',
}

export default interface MechState {
  id: string
  typ: string
  status: MechStatus
  index: Grid
}
