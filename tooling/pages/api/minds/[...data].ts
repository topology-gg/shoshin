import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import {
    COLLECTION_NAME_PVP,
    Character,
    DB_NAME,
} from '../../../src/constants/constants';
import { PvPProfile } from '../../../src/helpers/pvpHelper';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { data } = req.query;

    const client: MongoClient = await clientPromise;
    const db = client.db(DB_NAME);
    const pvpProfileCollection = db.collection<PvPProfile>(COLLECTION_NAME_PVP);
    const playerName = data[0];
    const character =
        data[1].charAt(0).toUpperCase() + data[1].substring(1).toLowerCase();
    const mindName = data[2];
    if (req.method === 'PUT') {
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
                        lastAgentModified: new Date().getTime(),
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
    } else if (req.method === 'GET') {
        console.log('get request');
        const result = await pvpProfileCollection.findOne({
            mindName: mindName,
            playerName: playerName,
            'agent.character': character as Character,
        });

        if (!result) {
            res.status(404).json({ error: 'Mind not found' });
        } else {
            res.status(200).json(result);
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
