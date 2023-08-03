import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import {
    COLLECTION_NAME_PVP,
    Character,
    DB_NAME,
} from '../../../src/constants/constants';
import { runRank } from '../../../src/helpers/pvpHelper';
import {
    PlayerAgent
} from '../../../src/types/Agent';
type PvPResult = {
    result: 'win' | 'loss';
    score: number;
    hp: number;
};

type PvPProfile = {
    mindName: string;
    playerName: string;
    agent: PlayerAgent;
    rank: number;
    records: Map<string, PvPResult>;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { data } = req.query;
    console.log('req.body', req.body);
    if (req.method === 'PUT') {
        const client: MongoClient = await clientPromise;
        const db = client.db(DB_NAME);
        const pvpProfileCollection =
            db.collection<PvPProfile>(COLLECTION_NAME_PVP);
        const playerName = data[0];
        const character = data[1];
        const mindName = data[2];

        try {
            const updateResult = await pvpProfileCollection.updateOne(
                {
                    $and: [
                        { mindName: mindName },
                        { playerName: playerName },
                        { 'agent.character': character as Character },
                    ],
                },
                {
                    $set: {
                        agent: req.body,
                        mindName: mindName,
                        playerName: playerName,
                    },
                },
                { upsert: true }
            );
            if (updateResult.acknowledged) {
                const latest = await pvpProfileCollection.findOne({
                    $and: [
                        { mindName: mindName },
                        { playerName: playerName },
                        { 'agent.character': character as Character },
                    ],
                });
                if (!latest) {
                    console.error(
                        `unable to update minds, req url = ${
                            req.url
                        }, req body = ${JSON.stringify(
                            req.body
                        )}, update result = ${JSON.stringify(updateResult)},  `
                    );
                    res.status(500).json({
                        error: 'Error updating mind, unable to find updated minds',
                    });
                    return;
                }
                const { _id, ...responseBody } = latest;
                res.status(200).json(responseBody);
                runRank(latest);
            } else {
                console.error(
                    `unable to update minds, req url = ${
                        req.url
                    }, req body = ${JSON.stringify(
                        req.body
                    )}, update result = ${JSON.stringify(updateResult)},  `
                );
                res.status(500).json({
                    error: 'Error updating mind: Failed to upload minds',
                });
            }
        } catch (error) {
            console.error('unable to update minds, error = ' + error);
            res.status(500).json({
                error: 'Error updating mind: Internal Server Error',
            });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

