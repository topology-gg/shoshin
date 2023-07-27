
import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { Character, DB_NAME } from '../../../src/constants/constants';
import { PlayerAgent } from '../../../src/types/Agent';

type SubmittedMind = {
    mindName: string ,
    playerName: string, 
    mind: PlayerAgent
}

type PutRequest = {
    mind: PlayerAgent,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { data } = req.query;
    if(req.method === 'PUT') {
        const client: MongoClient = await clientPromise;
        const db = client.db(DB_NAME);
        const submittedMinds = db.collection<SubmittedMind>('shoshin-pvp');
        const playerName = data[0];
        const character = data[1];
        const mindName = data[2];
        try {
            const updateResult = await submittedMinds.updateOne({ 
                $and: [{mindName: mindName} ,{playerName: playerName}, {"mind.character": character as Character}] 
            }, { $set: { 
                mind: (req.body as PutRequest).mind,
                mindName: mindName,
                playerName: playerName
            } }, { upsert: true });    
            if(updateResult.acknowledged){
                const latest = await submittedMinds.findOne({ 
                    $and: [{mindName: mindName} ,{playerName: playerName}, {"mind.character": character as Character}] 
                }, );
                if(!latest){
                    console.error(`unable to update minds, req url = ${req.url}, req body = ${req.body}, update result = ${updateResult},  ` );
                    res.status(500).json({ error: 'Error updating mind, unable to find updated minds' });
                    return;
                }
                const { _id, ...responseBody } = latest;
                res.status(200).json(responseBody);
            }else{
                console.error(`unable to update minds, req url = ${req.url}, req body = ${req.body}, update result = ${updateResult},  ` );
                res.status(500).json({ error: 'Error updating mind: Failed to upload minds' });
            }
        } catch (error) {
            console.error('unable to update minds, error = ' + error);
            res.status(500).json({ error: 'Error updating mind: Internal Server Error' });
        }


    }else{
        res.status(405).json({ error: 'Method not allowed' });
    }
}