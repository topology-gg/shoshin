
import clientPromise from "../../../lib/mongodb"
import { DB_NAME, COLLECTION_NAME_WHITELIST } from '../../../src/constants/constants'


// Returns an array of whitelist-user objects

export interface WhitelistUser {
    username : string,
    address : string
}
export default async function handler(req, res) {

    const client = await clientPromise
    const db = client.db(DB_NAME)
    const users : WhitelistUser[] = await db
        .collection(COLLECTION_NAME_WHITELIST)
        .find({})
        .toArray()

    res.status(200).json(users)
}
