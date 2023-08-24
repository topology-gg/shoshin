import clientPromise from '../../../lib/mongodb';
import {
    DB_NAME,
    COLLECTION_NAME_CAMPAIGN_SCORES,
    COLLECTION_NAME_CAMPAIGN_MINDS,
} from '../../../src/constants/constants';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const mindId = req.query.id;

    const queryFilter = { id: mindId };

    const mind = await db
        .collection(COLLECTION_NAME_CAMPAIGN_MINDS)
        .find(queryFilter)
        .toArray();

    res.status(200).json({ mind });
}
