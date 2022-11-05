import React from 'react'
import {
    useSolutions
} from '../../lib/api'

const Leaderboard = () => {

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
                        solutions ?
                        solutions.map((sol, sol_i) =>
                            <tr key={`sol-row-${sol_i}`} className="solution_row">
                                <td key={`sol-rowidx-${sol_i}`}>{sol_i}</td>
                                <td key={`sol-account-${sol_i}`}>{sol.solver}</td>
                                <td key={`sol-delivered-${sol_i}`}>{sol.delivered}</td>
                                <td key={`sol-static-cost-${sol_i}`}>{sol.static_cost}</td>
                                <td key={`sol-latency-${sol_i}`}>{sol.latency}</td>
                                <td key={`sol-dynamic-cost-${sol_i}`}>{sol.dynamic_cost}</td>
                            </tr>
                        ) : <></>
                    }
                </tbody>
            </table>
        </>
    )
}

export default Leaderboard
