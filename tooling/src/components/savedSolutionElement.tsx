import React from 'react'
import Solution from '../types/Solution'

export default function SavedSolutionElement ({ key, name, onClick }) {

    // render table row
    return (
        <button
            style={{
                border: '1px solid #555555',
                borderRadius: '3px',
                fontSize: '12px',
                margin:'0 3px 0 3px',
            }}
            onClick={onClick}
            key={key}
        >
            {name}
        </button>
    )

}
