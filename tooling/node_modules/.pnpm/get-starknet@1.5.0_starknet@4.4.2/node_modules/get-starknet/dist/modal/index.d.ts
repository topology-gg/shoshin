import type { GetStarknetWalletOptions, IStarknetWindowObject } from "../types";
import "svelte";
export default function show(installed: IStarknetWindowObject[], options?: GetStarknetWalletOptions): Promise<IStarknetWindowObject | undefined>;
