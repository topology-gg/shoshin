
import clientPromise from "../../lib/mongodb"

export default async function handler(req, res) {

    const client = await clientPromise
    const { account } = req.query

    const db = client.db('mumu_indexer')
    const solutions = await db
        .collection('mumu-s0-events')
        .find({
            instructions: {
                $not: { $size: 0 }
            },
            delivered: {
                $ne: 0
            }
        })
        .toArray()

    res.status(200).json({ 'solutions': solutions })
}
