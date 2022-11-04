import React from 'react'
import {
    useSolutions
} from '../../lib/api'

const Leaderboard = () => {

    const { data: solutions } = useSolutions ()

    console.log ('> queried solutions:', solutions)

    return (
        <div>Leaderboard</div>
    )
}

export default Leaderboard
