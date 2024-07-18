import clientPromise from '../../../lib/mongodb';
import { DB_NAME, COLLECTION_NAME_PVP } from '../../../src/constants/constants';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const mindName = req.query.mindName;
    const playerName = req.query.playerName;

    let queryFilter: any = {};
    if (mindName) {
        const regexPattern = `.*${mindName}.*`;
        queryFilter.mindName = { $regex: regexPattern, $options: 'i' };
    }

    if (playerName) {
        const regexPattern = `.*${playerName}.*`;
        queryFilter.playerName = { $regex: regexPattern, $options: 'i' };
    }

    const onlineOpponents = await db
        .collection(COLLECTION_NAME_PVP)
        .find(queryFilter)
        .sort({ rank: 1 }) // sort by _id descending
        .limit(100) // get 20 last tuple of agents
        .toArray();

    res.status(200).json({ onlineOpponents: onlineOpponents });
}
