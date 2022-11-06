
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
        .sort({
            'delivered': -1, // prefer large
            'static_cost': +1, // prefer small
            'latency': +1, // prefer small
            'dynamic_cost': +1, // prefer small
            '_chain.valid_from': +1 // prefer small
        })
        .limit (20) // get top 20 solutions; TODO: reject same solution on contract side
        .toArray()

    res.status(200).json({ 'solutions': solutions })
}
