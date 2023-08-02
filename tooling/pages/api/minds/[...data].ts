import { MongoClient, WithId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import {
    COLLECTION_NAME_PVP,
    Character,
    DB_NAME,
} from '../../../src/constants/constants';
import cairoOutputToFrameScene from '../../../src/helpers/cairoOutputToFrameScene';
import Agent, {
    PlayerAgent,
    agentsToArray,
    buildAgent,
} from '../../../src/types/Agent';
import { FrameScene } from '../../../src/types/Frame';
import { layersToAgentComponents } from '../../../src/types/Layer';
import wasm from '../../../wasm/shoshin/pkg_nodejs/shoshin';
type PvPResult = {
    result: 'win' | 'loss';
    score: number;
    hp: number;
};

type PvPProfile = {
    mindName: string;
    playerName: string;
    agent: PlayerAgent;
    rank: number;
    records: Map<string, PvPResult>;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { data } = req.query;
    console.log('req.body', req.body);
    if (req.method === 'PUT') {
        const client: MongoClient = await clientPromise;
        const db = client.db(DB_NAME);
        const pvpProfileCollection =
            db.collection<PvPProfile>(COLLECTION_NAME_PVP);
        const playerName = data[0];
        const character = data[1];
        const mindName = data[2];

        try {
            const updateResult = await pvpProfileCollection.updateOne(
                {
                    $and: [
                        { mindName: mindName },
                        { playerName: playerName },
                        { 'agent.character': character as Character },
                    ],
                },
                {
                    $set: {
                        agent: req.body,
                        mindName: mindName,
                        playerName: playerName,
                    },
                },
                { upsert: true }
            );
            if (updateResult.acknowledged) {
                const latest = await pvpProfileCollection.findOne({
                    $and: [
                        { mindName: mindName },
                        { playerName: playerName },
                        { 'agent.character': character as Character },
                    ],
                });
                if (!latest) {
                    console.error(
                        `unable to update minds, req url = ${
                            req.url
                        }, req body = ${JSON.stringify(
                            req.body
                        )}, update result = ${JSON.stringify(updateResult)},  `
                    );
                    res.status(500).json({
                        error: 'Error updating mind, unable to find updated minds',
                    });
                    return;
                }
                const { _id, ...responseBody } = latest;
                res.status(200).json(responseBody);
                postProcess(latest);
            } else {
                console.error(
                    `unable to update minds, req url = ${
                        req.url
                    }, req body = ${JSON.stringify(
                        req.body
                    )}, update result = ${JSON.stringify(updateResult)},  `
                );
                res.status(500).json({
                    error: 'Error updating mind: Failed to upload minds',
                });
            }
        } catch (error) {
            console.error('unable to update minds, error = ' + error);
            res.status(500).json({
                error: 'Error updating mind: Internal Server Error',
            });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

async function postProcess(newProfile: WithId<PvPProfile>) {
    const client: MongoClient = await clientPromise;
    const db = client.db(DB_NAME);

    const pvpProfileCollection = db.collection<PvPProfile>(COLLECTION_NAME_PVP);
    let pvpProfiles = await pvpProfileCollection
        .find({})
        .sort({ _id: -1 })
        .toArray();

    const update = pvpProfiles.find((profile) => {
        return profile._id.toString() == newProfile._id.toString();
    });

    if (update) {
        update.records = null;
    }

    const rankedMinds = await rankMinds(pvpProfiles);
    const bulkUpdate = generateBulkUpdate(rankedMinds);
    await pvpProfileCollection.bulkWrite(bulkUpdate);
}

async function rankMinds(pvpProfiles: WithId<PvPProfile>[]) {
    const unrankedProfiles = pvpProfiles.filter(
        (profile) => profile.records == null || profile.records.size == 0
    );

    for (let i = 0; i < unrankedProfiles.length; i++) {
        const unrankedProfile = unrankedProfiles[i];
        if (unrankedProfile.records == null)
            unrankedProfile.records = new Map<string, PvPResult>();

        for (let j = 0; j < pvpProfiles.length; j++) {
            const profile = pvpProfiles[j];
            if (profile._id == unrankedProfile._id) continue;
            if (unrankedProfile.records.has(getProfileKey(profile))) continue;
            if (profile.records == null)
                profile.records = new Map<string, PvPResult>();
            else if (!(profile.records instanceof Map))
                profile.records = new Map(Object.entries(profile.records));

            const result = await fight(unrankedProfile, profile);
            unrankedProfile.records.set(getProfileKey(profile), result[0]);
            profile.records.set(getProfileKey(unrankedProfile), result[1]);
        }
    }
    const result = pvpProfiles.sort((prev, curr) => {
        if (!(prev.records instanceof Map))
            prev.records = new Map(Object.entries(prev.records));
        if (!(curr.records instanceof Map))
            curr.records = new Map(Object.entries(curr.records));
        const prevWins = Array.from(prev.records.values()).filter(
            (result) => result.result == 'win'
        ).length;
        const currWins = Array.from(curr.records.values()).filter(
            (result) => result.result == 'win'
        ).length;
        if (prevWins == currWins) {
            return prev.records.get(getProfileKey(curr))?.result == 'win'
                ? -1
                : 1;
        }
        return currWins - prevWins;
    });

    result.forEach((profile, index) => {
        profile.rank = index + 1;
    });

    return result;
}

function getProfileKey(profile: PvPProfile): string {
    return `${profile.playerName}-${profile.mindName}-${profile.agent.character}`;
}

async function fight(
    challenger: PvPProfile,
    opponent: PvPProfile
): Promise<[PvPResult, PvPResult]> {
    const p1 = getAgentFromProfile(challenger);
    const p2 = getAgentFromProfile(opponent);

    const [output, err] = await runSimulation(p1, p2);

    const p1FinalHp =
        output.agent_0[output.agent_1.length - 1].body_state.integrity;
    const p2FinalHp =
        output.agent_1[output.agent_1.length - 1].body_state.integrity;
    const beatAgent = output !== undefined ? p1FinalHp > p2FinalHp : false;

    return [
        { result: beatAgent ? 'win' : 'loss', score: p1FinalHp, hp: p1FinalHp },
        { result: beatAgent ? 'loss' : 'win', score: p2FinalHp, hp: p2FinalHp },
    ];
}

async function runSimulation(
    p1: Agent,
    p2: Agent
): Promise<[FrameScene, Error]> {
    let shoshinInput = new Int32Array(agentsToArray(p1, p2));
    let output = wasm.runCairoProgram(shoshinInput);
    return [cairoOutputToFrameScene(output), null];
}

function getAgentFromProfile(profile: PvPProfile): Agent {
    const playerAgent = profile.agent;
    const char = Object.keys(Character).indexOf(playerAgent.character);
    const {
        mentalStates: generatedMs,
        conditions: generatedConditions,
        trees: generatedTrees,
    } = layersToAgentComponents(playerAgent.layers, char, playerAgent.combos);

    return buildAgent(
        generatedMs,
        playerAgent.combos,
        generatedTrees,
        generatedConditions,
        0,
        char
    );
}

function generateBulkUpdate(pvpProfiles: WithId<PvPProfile>[]): any[] {
    const bulkUpdate = [];
    pvpProfiles.forEach((profile) => {
        bulkUpdate.push({
            updateOne: {
                filter: { _id: profile._id },
                update: { $set: profile },
                upsert: true,
            },
        });
    });
    return bulkUpdate;
}
