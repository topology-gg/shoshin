import clientPromise from '../../../lib/mongodb';
import {
    DB_NAME,
    COLLECTION_NAME_LEAGUE,
} from '../../../src/constants/constants';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const agents = await db
        .collection(COLLECTION_NAME_LEAGUE)
        .find({})
        .sort({
            '_chain.valid_from': 1,
        })
        .limit(20) // get 20 last tuple of agents
        .toArray();

    res.status(200).json({ agents: agents });
}
