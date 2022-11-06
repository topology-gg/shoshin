import React from 'react'
import { toBN } from 'starknet/dist/utils/number'
import {
    useSolutions,
} from '../../lib/api'
import LeaderboardRow from './LeaderboardRow'

const Leaderboard = ({ loadSolution }) => {

    const { data } = useSolutions ()

    const solutions: any[] = data?.solutions
    console.log ('> queried solutions:', solutions)

    return (
        <>
            <p>Leaderboard</p>
            <table style={{marginBottom:'30px'}}>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Account</th>
                        <th>Delivered</th>
                        <th>Static Cost</th>
                        <th>Latency</th>
                        <th>Dynamic Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        solutions ? solutions.map(
                            (solution, index) => {
                                console.log('> solution', solution)
                                console.log('> index', index)
                                return <LeaderboardRow solution={solution} index={index} loadSolution={loadSolution}/>;
                            }
                        )
                        :
                        <></>
                    }
                </tbody>
            </table>
        </>
    )
}

export default Leaderboard
