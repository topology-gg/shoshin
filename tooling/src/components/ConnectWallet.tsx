import React, { useState, useEffect } from "react";
import {useAccount, useConnectors} from '@starknet-react/core'

import Modal from "../ui_common/Modal";
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

export default function ConnectWallet ({open, setSettingOpen}) {
    const { available, connect } = useConnectors()
    const [connectors, setConnectors] = useState([])
    const [walletNotFound, setWalletNotFound] = useState(false)

    const { account, address } = useAccount()

    let modalRender;

    // Connectors are not available server-side therefore we
    // set the state in a useEffect hook
    useEffect(() => {
        if (available) setConnectors(available)
    }, [available])

    if (!account) {
        const menu_items_sorted = [].concat(connectors)
        .sort ((a,b) => {
            if(a.name() < b.name()) { return -1; }
            if(a.name() > b.name()) { return 1; }
            return 0;
        })
        .map ((connector) => (
            <MenuItem
                key={connector.id()}
                onClick={() => {
                    connect(connector)
                    setSettingOpen(false)
                }}
                sx={{justifyContent: 'center'}}
            >
                {connector.name()}
            </MenuItem>
        ))

        modalRender = (
            <MenuList>

                {connectors.length > 0 ? menu_items_sorted : (
                    <>
                        <button onClick={() => setWalletNotFound(true)}>Connect</button>
                        {walletNotFound && <p className='error-text'>Wallet not found. Please install ArgentX or Braavos.</p>}
                    </>
                )}

            </MenuList>
        )
    }
    
    return (
        <Modal 
            open={open} width={450} onClose={() => {setSettingOpen(false)}} 
            maxWidth={false}
        >
            {modalRender}
        </Modal>
    )
};