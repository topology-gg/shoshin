import { MongoClient, WithId } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import wasm from '../../wasm/shoshin/pkg_nodejs/shoshin';
import {
    COLLECTION_NAME_PVP,
    Character,
    DB_NAME,
} from '../constants/constants';
import Agent, { PlayerAgent, agentsToArray, buildAgent } from '../types/Agent';
import { FrameScene } from '../types/Frame';
import { layersToAgentComponents } from '../types/Layer';
import cairoOutputToFrameScene from './cairoOutputToFrameScene';
type PvPResult = {
    result: 'win' | 'loss';
    score: number;
    hp: number;
};

export type PvPProfile = {
    mindName: string;
    playerName: string;
    agent: PlayerAgent;
    rank: number;
    records: Map<string, PvPResult>;
    lastAgentModified: number;
    lastRankTime: number;
};

export async function runRank() {
    const client: MongoClient = await clientPromise;
    const db = client.db(DB_NAME);

    const pvpProfileCollection = db.collection<PvPProfile>(COLLECTION_NAME_PVP);
    let pvpProfiles = await pvpProfileCollection
        .find({})
        .sort({ _id: -1 })
        .toArray();

    const modifiedAgent = pvpProfiles.filter(
        (profile) =>
            !profile.lastRankTime ||
            profile.lastAgentModified > profile.lastRankTime
    );
    modifiedAgent.forEach((profile) => {
        profile.records = null;
    });

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
