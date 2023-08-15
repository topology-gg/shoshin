import { Command } from 'commander';

import { MongoClient, ChangeStream } from 'mongodb';
import {
    COLLECTION_NAME_CAMPAIGN_MINDS,
    DB_NAME,
} from '../../src/constants/constants';
import clientPromise from '../../lib/mongodb';
require('dotenv').config();

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

(async () => {
    if (!MONGO_CONNECTION_STRING) {
        throw new Error(
            'Please add MONGO_CONNECTION_STRING to your .env.local'
        );
    }
    const client = new MongoClient(MONGO_CONNECTION_STRING, {});

    try {
        await client.connect();

        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME_CAMPAIGN_MINDS);

        const changeStream: ChangeStream = collection.watch();

        changeStream.on('change', (change) => {
            // Perform your desired action with the change event
            console.log('Change event:', change);
        });

        // Keep the script running
        await new Promise(() => {});
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
})();
