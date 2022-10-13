import {useState, useEffect, useRef, CSSProperties} from 'react';
import UnitState, {BgStatus, BorderStatus} from '../src/types/UnitState';

export default function Unit({state, typ}) {

    // Constants
    const gridStyle = {
        display: 'flex',
        fontSize: '0.6em',
        margin: '0.2rem',
        padding: '0rem',
        width: '1.2rem',
        height: '1.2rem',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'inherit',
        textDecoration: 'none',
        borderRadius: '0.6rem',
        transition: 'color 0.05s ease, border-color 0.05s ease',
        maxWidth: '300px'
    } as CSSProperties;

    // Compute style based on props (from parent's React state)
    var style = gridStyle;
    if (state.bg_status === BgStatus.ATOM_VANILLA_FREE) {
        style = {...style, backgroundColor: '#FF355E'}
    }
    else if (state.bg_status === BgStatus.ATOM_VANILLA_POSSESSED) {
        style = {...style, backgroundColor: '#FF355E'}
    }

    if (state.border_status == BorderStatus.SINGLETON_OPEN) {
        style = {...style, border: '1px solid #BBBBBB'}
    }
    else if (state.border_status == BorderStatus.SINGLETON_CLOSE) {
        style = {...style, border: '1px solid #111111'}
    }
    else {
        style = {...style, border: '1px solid #FFFFFF'}
    }

    var text: string;
    if (typ == 'faucet') {
        text = 'F'
    }
    else if (typ == 'sink') {
        text = 'S'
    }
    else {
        text = '·'
    }

    // Render
    return (
        <div style={style} className={'grid'}>{text}</div>
    )
}
