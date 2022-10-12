import {useState, useEffect, useRef, CSSProperties} from 'react';
import UnitState, {BgStatus, BorderStatus} from '../src/types/UnitState';

export default function Unit({ state }) {

    // Constants
    const gridStyle = {
        display: 'flex',
        fontSize: '0.2em',
        margin: '0.2rem',
        padding: '0rem',
        width: '1rem',
        height: '1rem',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'inherit',
        textDecoration: 'none',
        borderRadius: '0.5rem',
        transition: 'color 0.15s ease, border-color 0.15s ease',
        maxWidth: '300px'
    } as CSSProperties;

    // Compute style based on props (from parent's React state)
    var style = gridStyle;
    if (state.bg_status === BgStatus.ATOM_VANILLA_FREE) {
        style = {...style, backgroundColor: '#DA2C43'}
    }
    else if (state.bg_status === BgStatus.ATOM_VANILLA_POSSESSED) {
        style = {...style, backgroundColor: '#FF6347'}
    }

    if (state.border_status === BorderStatus.SINGLETON_OPEN) {
        style = {...style, border: '1px solid #FFFFFF'}
    }
    else if (state.border_status === BorderStatus.SINGLETON_CLOSE) {
        style = {...style, border: '1px solid #FF7A00'}
    }

    // Render
    return (
        <div style={style} className={'grid'}> · </div>
    )
}
