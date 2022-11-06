import { CSSProperties } from '@mui/styled-engine'
import React from 'react'
import { toBN } from 'starknet/dist/utils/number'
import Solution from '../types/Solution'
import MechState from '../types/MechState'
import Operator from '../types/Operator'
import {
    useSolutions,
    useStardiscRegistryByAccount
} from '../../lib/api'
import { MechStatus, MechType } from '../types/MechState'

const SCALE = 10**6

export default function LeaderboardRow ({ solution, index, loadSolution }) {

    const address = solution.solver
    const account_str_decimal = toBN(address).toString(10)
    const { data: stardisc_query } = useStardiscRegistryByAccount (account_str_decimal) // must be a better way than fetching the entire registry

    let solver_name
    if (!stardisc_query) solver_name = 'loading...'
    else if (stardisc_query.stardisc_query.length > 0) { // query succeeded, render the handle
        const name = toBN(stardisc_query.stardisc_query[0].name).toString(10)
        const name_string = feltLiteralToString (name)
        solver_name = name_string
    }
    else { // query failed; render address abbreviation
        solver_name = String(address).slice(0,5) + '...' + String(address).slice(-4)
    }

    //
    // extract solution in react-loadable type (type Solution)
    //
    let extractedSolution: Solution = {
        mechs: solution.mechs.map ((mech) => {
            return {id: mech.id.toString(), typ: MechType.SINGLETON, status: MechStatus.OPEN, index: {x:mech.index.x, y:mech.index.y} ,pc_next:0} as MechState
        }),
        programs: [], // string[]
        operators: [] // Operator[]
    }


    // export default interface Solution {
    //     mechs: MechState[]
    //     programs: string[]
    //     operators: Operator[]
    // }

    // export default interface MechState {
    //     id: string
    //     typ: MechType
    //     status: MechStatus
    //     index: Grid
    //     pc_next: number
    // }

    // // TODO: we want dependently-typed interface i.e. Operator.input would have array size determined by Operator.typ
    // export default interface Operator {
    //     input: Grid[];
    //     output: Grid[];
    //     typ: OperatorType; // STIR, SHAKE, STEAM, SMASH
    // }


    function handleOnClick() {
        if (!extractedSolution) return;
    }
    const tr_style = !extractedSolution ? {backgroundColor: '#DDDDDD', color: '#999999'} : {backgroundColor: ''}

    // render table row
    return (
        <tr key={`sol-row-${index}`} className="solution_row" onClick={()=>handleOnClick()} style={tr_style}>
            <td className={'leaderboard_row'} key={`sol-rowidx-${index}`}>{index}</td>
            <td className={'leaderboard_row'} key={`sol-account-${index}`}>{solver_name}</td>
            <td className={'leaderboard_row'} key={`sol-delivered-${index}`}>{solution.delivered}</td>
            <td className={'leaderboard_row'} key={`sol-static-cost-${index}`}>{solution.static_cost}</td>
            <td className={'leaderboard_row'} key={`sol-latency-${index}`}>{solution.latency / SCALE}</td>
            <td className={'leaderboard_row'} key={`sol-dynamic-cost-${index}`}>{solution.dynamic_cost / SCALE}</td>
        </tr>
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