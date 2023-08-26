import clientPromise from '../../../lib/mongodb';
import {
    DB_NAME,
    COLLECTION_NAME_CAMPAIGN_SCORES,
} from '../../../src/constants/constants';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const opponentIndexes = req.query.opponentIndexes;
    const limit = req.query.max ? parseInt(req.query.max) : 999999;

    const opponentIndexArray = opponentIndexes
        ? opponentIndexes.split(',')
        : [];

    const queryFilter =
        opponentIndexArray.length > 0
            ? { opponentIndex: { $in: opponentIndexArray } }
            : {};

    console.log('opp id', queryFilter);
    const scores = await db
        .collection(COLLECTION_NAME_CAMPAIGN_SCORES)
        .find(queryFilter)
        .sort({ 'score.totalScore': -1 }) // sort by total field in descending order
        .limit(limit) // get 20 last tuples of agents
        .toArray();

    res.status(200).json({ scores: scores });
}
