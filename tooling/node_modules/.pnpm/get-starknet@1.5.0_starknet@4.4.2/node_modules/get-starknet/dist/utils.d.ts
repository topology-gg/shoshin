import type { GetStarknetWalletOptions, IStarknetWindowObject, Order, WalletProvider } from "./types";
/**
 * @see https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/generateUniqueID.ts
 */
export declare const generateUID: () => string;
export declare const shuffle: <T extends any[]>(arr: T) => T;
/**
 * filters given wallets array, return only preAuthorized instances
 * @param wallets
 */
export declare const filterPreAuthorized: (wallets: IStarknetWindowObject[]) => Promise<IStarknetWindowObject[]>;
export declare const isWalletObj: (key: string, wallet: any) => boolean;
export declare const sortBy: <T extends IStarknetWindowObject | WalletProvider>(wallets: T[], order: Order) => T[];
export declare function filterBy<T extends IStarknetWindowObject | WalletProvider>(installed: T[], options?: Omit<GetStarknetWalletOptions, "showList">): T[];
