import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import {
    COLLECTION_NAME_CAMPAIGN_MINDS,
    COLLECTION_NAME_PVP,
    Character,
    DB_NAME,
} from '../../../src/constants/constants';
import { PlayerAgent } from '../../../src/types/Agent';

type CampaignMind = {
    opponentIndex: string;
    address: string;
    mind: PlayerAgent;
};

type PutRequest = {
    mind: PlayerAgent;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { opponent } = req.query;

    console.log('in opp api', req);
    const client: MongoClient = await clientPromise;
    const db = client.db(DB_NAME);
    const campaingMinds = db.collection<CampaignMind>(
        COLLECTION_NAME_CAMPAIGN_MINDS
    );

    const opponentIndex = Array.isArray(opponent) ? opponent[0] : opponent;

    if (req.method === 'POST') {
        try {
            const updateResult = await campaingMinds.insertOne({
                mind: req.body,
                address: req.body.address,
                opponentIndex: opponentIndex,
            });
            if (updateResult.acknowledged) {
                res.status(200);
            } else {
                console.error(
                    `unable to update minds, req url = ${req.url}, req body = ${req.body}, update result = ${updateResult},  `
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
