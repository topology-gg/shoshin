import {
    useContract
} from '@starknet-react/core'

import SimulatorAbi from '../../abi/simulator_abi.json'
export const SIMULATOR_ADDR = '0x04774c58e145332500a2a534fc321968441193b660e2e95c0bab713dbc9b090d'

export function useSimulatorContract () {
    return useContract ({ abi: SimulatorAbi, address: SIMULATOR_ADDR })
}
