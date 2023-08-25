import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';
import {
    DB_NAME,
    COLLECTION_NAME_CAMPAIGN_SCORES,
    COLLECTION_NAME_CAMPAIGN_MINDS,
} from '../../../src/constants/constants';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const mindId = new ObjectId(req.query.id);

    const queryFilter = { _id: mindId };

    console.log('campaign minds', queryFilter);
    const mind = await db
        .collection(COLLECTION_NAME_CAMPAIGN_MINDS)
        .findOne(queryFilter);

    res.status(200).json({ mind });
}
