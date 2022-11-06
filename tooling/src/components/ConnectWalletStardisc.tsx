import {useAccount, useConnectors} from '@starknet-react/core'
import { useEffect, useState } from 'react'
// import Button from './Button'
import { toBN } from 'starknet/dist/utils/number'
import styles from './ConnectWallet.module.css'
import { Trans, useTranslation } from "react-i18next";

import {
    useStardiscRegistryByAccount
} from '../../lib/api'

export default function ConnectWalletStardisc() {

    const { t } = useTranslation();

    const { available, connect, disconnect } = useConnectors()
    const [connectors, setConnectors] = useState([])
    const [walletNotFound, setWalletNotFound] = useState(false)

    const { account, address, status } = useAccount()
    const account_str_decimal = toBN(address).toString(10)
    const { data: stardisc_query } = useStardiscRegistryByAccount (account_str_decimal) // must be a better way than fetching the entire registry

    // Connectors are not available server-side therefore we
    // set the state in a useEffect hook
    useEffect(() => {
        if (available) setConnectors(available)
    }, [available])

    const makeshift_button_style = {marginLeft:'0.2rem', marginRight:'0.2rem', height:'1.5rem'}

    const BUTTON_STYLE = {
        height: '1.5rem',
        width: 'auto',
        cursor: 'pointer',
        fontSize : '12px',
        borderRadius : '3px',
        border: '1px solid #000',
    }
    if (account) {
        if (!stardisc_query) return;

        let rendered_account
        if (stardisc_query.stardisc_query.length > 0) { // query succeeded, render the handle
            const name = toBN(stardisc_query.stardisc_query[0].name).toString(10)
            const name_string = feltLiteralToString (name)
            rendered_account = <p className='result'>{t("Connected")} <strong>{name_string}</strong></p>
        }
        else { // query failed; render address abbreviation
            rendered_account = <p  className='result'>{t("Connected")} {String(address).slice(0,5) + '...' + String(address).slice(-4)}t</p>
        }

        return (
            <div className={styles.wrapper}>
                {/* <p className={styles.text}>
                    Connected:
                </p> */}
                {rendered_account}
                <button
                    className='creamy-button'
                    style={BUTTON_STYLE}
                    onClick={() => disconnect()}
                >
                    Disconnect
                </button>
            </div>
        )
    }

    const buttons_sorted = [].concat(connectors)
        .sort ((a,b) => {
            if(a.name() < b.name()) { return -1; }
            if(a.name() > b.name()) { return 1; }
            return 0;
        })
        .map ((connector) => (
            <button
                key={connector.id()}
                onClick={() => connect(connector)}
                style = {BUTTON_STYLE}
                className = 'creamy-button'
            >
                {t("Connect")}{connector.name()}
            </button>
        ))

    return (
        <div className={`${styles.wrapper} ${styles.wrapperConnectButtons}`}>
                {connectors.length > 0 ? buttons_sorted : (
                    <>
                        <button onClick={() => setWalletNotFound(true)}>Connect</button>
                        {walletNotFound && <p className='error-text'>Wallet not found. Please install ArgentX or Braavos.</p>}
                    </>
                )}
        </div>
    )
}

// reference: https://stackoverflow.com/a/66228871
function feltLiteralToString (felt: string) {

    const tester = felt.split('');

    let currentChar = '';
    let result = "";
    const minVal = 25;
    const maxval = 255;

    for (let i = 0; i < tester.length; i++) {
        currentChar += tester[i];
        if (parseInt(currentChar) > minVal) {
            // console.log(currentChar, String.fromCharCode(currentChar));
            result += String.fromCharCode( parseInt(currentChar) );
            currentChar = "";
        }
        if (parseInt(currentChar) > maxval) {
            currentChar = '';
        }
    }

    return result
}