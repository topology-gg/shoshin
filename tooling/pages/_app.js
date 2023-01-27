import '../styles/globals.css'
import { StarknetConfig, InjectedConnector } from '@starknet-react/core'
import { SequencerProvider } from 'starknet'
import { WASMContextProvider } from '../src/context/WASM'

function MyApp({ Component, pageProps }) {
    const connectors = [
        new InjectedConnector({ options: { id: 'braavos' }}),
        new InjectedConnector({ options: { id: 'argentX' }}),
    ]

    const testnet1 = 'https://alpha4.starknet.io/'
    const testnet2 = 'https://alpha4-2.starknet.io/'

    return (
        <StarknetConfig connectors={connectors} defaultProvider={new SequencerProvider({baseUrl : testnet1})}>
            <WASMContextProvider>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
                <Component {...pageProps} />
            </WASMContextProvider>
        </StarknetConfig>
    )
}

export default MyApp
