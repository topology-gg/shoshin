import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useAccount, useConnectors } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as amplitude from '@amplitude/analytics-browser';
import { Button } from '@mui/material';
import mixpanel from 'mixpanel-browser';
import styles from './ConnectWallet.module.css';

const setUserId = (address:string) => {
    try {
        mixpanel.identify(address);
        amplitude.setUserId(address);
    } catch (error) {
        console.error(error);
    }
}

const clearUserId = () => {
    try {
        mixpanel.reset();
        amplitude.reset();
    } catch (error) {
        console.error(error);
    }
}

// export default function ConnectWallet ({ modalOpen, handleOnOpen, handleOnClose }) {
export default function ConnectWallet() {
    const { t } = useTranslation();

    // const [open, setOpen] = useState<boolean>(false);
    // const handleOpen = () => {setOpen(true);};
    // const handleClose = () => {setOpen(false);};

    const { account, address, status } = useAccount();
    const { available, connect, disconnect } = useConnectors();

    // React states
    const [connectors, setConnectors] = useState([]);
    const [walletNotFound, setWalletNotFound] = useState(false);

    let modalRender;

    // Connectors are not available server-side therefore we
    // set the state in a useEffect hook
    useEffect(() => {
        if (available) setConnectors(available);
    }, [available]);

    if (account) {
        let rendered_account = (
            <>
                Connected:{' '}
                {String(address).slice(0, 6) +
                    '...' +
                    String(address).slice(-4)}
            </>
        );

        modalRender = (
            <div className={styles.wrapper} style={{ paddingTop: '1rem' }}>
                <p style={{ margin: '0', fontSize: '14px' }}>
                    {rendered_account}
                </p>

                <MenuItem
                    sx={{ width: '100%', mt: 2, justifyContent: 'center' }}
                    onClick={() => {
                        disconnect();
                        clearUserId();
                    }}
                >
                    Disconnect
                </MenuItem>
            </div>
        );
        setUserId(address);
    } else {
        const menu_items_sorted = []
            .concat(connectors)
            .sort((a, b) => {
                if (a.name() < b.name()) {
                    return -1;
                }
                if (a.name() > b.name()) {
                    return 1;
                }
                return 0;
            })
            .map((connector) => (
                <MenuItem
                    key={connector.id()}
                    onClick={() => connect(connector)}
                    sx={{ justifyContent: 'center' }}
                >
                    {/* {t("Connect")}{connector.name()} */}
                    {connector.name()}
                </MenuItem>
            ));

        modalRender = (
            <MenuList>
                {connectors.length > 0 ? (
                    menu_items_sorted
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            onClick={() => setWalletNotFound(true)}
                        >
                            Connect
                        </Button>
                        {walletNotFound && (
                            <p className="error-text">
                                Wallet not found. Please install ArgentX or
                                Braavos.
                            </p>
                        )}
                    </>
                )}
            </MenuList>
        );
    }

    return modalRender;
}

// reference: https://stackoverflow.com/a/66228871
function feltLiteralToString(felt: string) {
    const tester = felt.split('');

    let currentChar = '';
    let result = '';
    const minVal = 25;
    const maxval = 255;

    for (let i = 0; i < tester.length; i++) {
        currentChar += tester[i];
        if (parseInt(currentChar) > minVal) {
            // console.log(currentChar, String.fromCharCode(currentChar));
            result += String.fromCharCode(parseInt(currentChar));
            currentChar = '';
        }
        if (parseInt(currentChar) > maxval) {
            currentChar = '';
        }
    }

    return result;
}
