import { useState, createContext } from "react";
import type { ReactNode } from "react";
import { useMountEffectOnce } from "../hooks/useMountEffectOnce";

const initial: IShoshinWASMContext = {};

export const ShoshinWASMContext = createContext(initial);

export const ShoshinWASMContextProvider: React.FC<ShoshinWASMContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<IShoshinWASMContext>(initial);

  // This has to run only once: https://github.com/rustwasm/wasm-bindgen/issues/3153
  // Though, in development React renders twice when Strict Mode is enabled: https://reactjs.org/docs/strict-mode.html
  // That's why it must be limited to a single mount run
  useMountEffectOnce(() => {
    (async () => {
      const wasm = await import("wasm-shoshin");
      await wasm.default();
      setState({ wasm });
    })();
  });

  return <ShoshinWASMContext.Provider value={state}>{children}</ShoshinWASMContext.Provider>;
};

export interface IShoshinWASMContext {
  wasm?: typeof import("wasm-shoshin");
}

interface ShoshinWASMContextProviderProps {
  children: ReactNode;
}