import clientPromise from '../../../../lib/mongodb';
import {
    DB_NAME,
    COLLECTION_NAME_CAMPAIGN_SCORES,
} from '../../../../src/constants/constants';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const scores = await db
        .collection(COLLECTION_NAME_CAMPAIGN_SCORES)
        .find({})
        .sort({ _id: -1 }) // sort by _id descending
        .limit(50) // get 20 last tuple of agents
        .toArray();

    res.status(200).json({ scores: scores });
}
