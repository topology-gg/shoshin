import '../styles/globals.css';
import { StarknetConfig, InjectedConnector } from '@starknet-react/core';
import { SequencerProvider } from 'starknet';
import { ShoshinWASMContextProvider } from '../src/context/wasm-shoshin';
import { ConditionWASMContextProvider } from '../src/context/wasm-condition';
import ControllerConnector from '@cartridge/connector';
import {
    CONTRACT_ADDRESS,
    ENTRYPOINT_AGENT_SUBMISSION,
} from '../src/constants/constants';

function MyApp({ Component, pageProps }) {
    const connectors = [
        new InjectedConnector({ options: { id: 'braavos' } }),
        new InjectedConnector({ options: { id: 'argentX' } }),
        new ControllerConnector([
            {
                method: ENTRYPOINT_AGENT_SUBMISSION,
                target: CONTRACT_ADDRESS,
            },
        ]),
    ];

    const testnet1 = 'https://alpha4.starknet.io/';
    const testnet2 = 'https://alpha4-2.starknet.io/';

    return (
        <StarknetConfig
            connectors={connectors}
            defaultProvider={new SequencerProvider({ baseUrl: testnet1 })}
        >
            <ConditionWASMContextProvider>
                <ShoshinWASMContextProvider>
                    <link
                        href="https://fonts.googleapis.com/icon?family=Material+Icons"
                        rel="stylesheet"
                    />
                    <Component {...pageProps} />
                </ShoshinWASMContextProvider>
            </ConditionWASMContextProvider>
        </StarknetConfig>
    );
}

export default MyApp;
