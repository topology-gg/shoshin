import React from 'react'
import { toBN } from 'starknet/dist/utils/number'
import {
    useSolutions,
} from '../../lib/api'
import LeaderboardRow from './LeaderboardRow'
import { useTranslation } from "react-i18next";

const Leaderboard = ({ loadSolution }) => {

    const { t } = useTranslation();

    const { data } = useSolutions ()
    const solutions: any[] = data?.solutions

    const th_style = {paddingBottom: '1rem'}
    return (
        <>
            <p style={{fontSize:'0.9rem'}}>{t("leaderboard.title")}</p>
            <table style={{marginBottom:'30px'}}>
                <thead>
                    <tr>
                        <th style={th_style}>{t("leaderboard.rank")}</th>
                        <th style={th_style}>{t("leaderboard.account")}</th>
                        <th style={th_style}>{t("leaderboard.delivered")}</th>
                        <th style={th_style}>{t("leaderboard.static_cost")}</th>
                        <th style={th_style}>{t("leaderboard.latency")}</th>
                        <th style={th_style}>{t("leaderboard.dynamic_cost")}</th>
                        <th style={th_style}>{t("leaderboard.block_number")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        solutions ? solutions.map(
                            (solution, index) => {
                                return <LeaderboardRow key={`leaderboard-row-${index}`} solution={solution} index={index} loadSolution={loadSolution}/>;
                            }
                        )
                        :
                        // <>{'loading...'}</>
                        <></>
                    }
                </tbody>
            </table>
        </>
    )
}

export default Leaderboard
