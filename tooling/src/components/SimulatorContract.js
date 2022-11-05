import {
    useContract
} from '@starknet-react/core'

import SimulatorAbi from '../../abi/simulator_abi.json'
export const SIMULATOR_ADDR = '0x06fea4edba44e89743f728a0c03bed6bf3cfeb99a43aa6d57c64dffc4d0a2538'

export function useSimulatorContract () {
    return useContract ({ abi: SimulatorAbi, address: SIMULATOR_ADDR })
}
