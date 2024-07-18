import { useState, createContext } from 'react';
import type { ReactNode } from 'react';
import { useMountEffectOnce } from '../hooks/useMountEffectOnce';

const initial: IConditionWASMContext = {};

export const ConditionWASMContext = createContext(initial);

export const ConditionWASMContextProvider: React.FC<
    ConditionWASMContextProviderProps
> = ({ children }) => {
    const [state, setState] = useState<IConditionWASMContext>(initial);

    // This has to run only once: https://github.com/rustwasm/wasm-bindgen/issues/3153
    // Though, in development React renders twice when Strict Mode is enabled: https://reactjs.org/docs/strict-mode.html
    // That's why it must be limited to a single mount run
    useMountEffectOnce(() => {
        (async () => {
            const wasm = await import('wasm-condition-evaluation');
            await wasm.default();
            setState({ wasm });
        })();
    });

    return (
        <ConditionWASMContext.Provider value={state}>
            {children}
        </ConditionWASMContext.Provider>
    );
};

interface IConditionWASMContext {
    wasm?: typeof import('wasm-condition-evaluation');
}

interface ConditionWASMContextProviderProps {
    children: ReactNode;
}
