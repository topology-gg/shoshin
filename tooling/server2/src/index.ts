import { MongoClient, ChangeStream } from 'mongodb';
import {
    COLLECTION_NAME_CAMPAIGN_MINDS,
    COLLECTION_NAME_CAMPAIGN_SCORES,
    DB_NAME,
} from 'next-exp/dist/src/constants/constants.js';
import { getScoreForOpponent } from './util.js';
import * as dotenv from 'dotenv';
dotenv.config();

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
        const collectionMinds = db.collection(COLLECTION_NAME_CAMPAIGN_MINDS);
        const collectionScores = db.collection(COLLECTION_NAME_CAMPAIGN_SCORES);

        const changeStream: ChangeStream = collectionMinds.watch();

        changeStream.on('change', async (change) => {
            // Perform your desired action with the change event
            console.log('Change event:', change);

            if (change.operationType === 'insert') {
                const [score, err] = await getScoreForOpponent(
                    change.fullDocument.mind,
                    change.fullDocument.opponentIndex
                );

                const existingScore = await collectionScores.findOne({
                    playerAddress: change.fullDocument.address,
                    opponentIndex: change.fullDocument.opponentIndex,
                    character: change.fullDocument.mind.character,
                });

                if (
                    existingScore != undefined &&
                    score.totalScore > existingScore.score.totalScore
                ) {
                    collectionScores.deleteOne({ _id: existingScore._id });
                    collectionScores.insertOne({
                        playerAddress: change.fullDocument.address,
                        mindId: change.fullDocument._id,
                        score: score,
                        opponentIndex: change.fullDocument.opponentIndex,
                        character: change.fullDocument.mind.character,
                    });
                } else if (existingScore == undefined) {
                    collectionScores.insertOne({
                        playerAddress: change.fullDocument.address,
                        mindId: change.fullDocument._id,
                        score: score,
                        opponentIndex: change.fullDocument.opponentIndex,
                        character: change.fullDocument.mind.character,
                    });
                }

                console.log('score is ', score, err);
            }
        });

        // Keep the script running
        await new Promise(() => {});
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
})();
