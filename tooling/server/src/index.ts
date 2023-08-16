import * as dotenv from 'dotenv';
import { MongoClient, WithId } from 'mongodb';
import { COLLECTION_NAME_PVP, Character, DB_NAME } from 'next-exp/dist/src/constants/constants.js';
import cairoOutputToFrameScene from 'next-exp/dist/src/helpers/cairoOutputToFrameScene.js';
import { PvPProfile, PvPResult } from 'next-exp/dist/src/helpers/pvpHelper.js';
import Agent, { agentsToArray, buildAgent } from 'next-exp/dist/src/types/Agent.js';
import { FrameScene } from 'next-exp/dist/src/types/Frame.js';
import { layersToAgentComponents } from 'next-exp/dist/src/types/Layer.js';
import wasm from 'next-exp/wasm/shoshin/pkg_nodejs/shoshin.js';
import cron from 'node-cron';

dotenv.config();

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING
const SCHEDULED_CRON = process.env.SCHEDULED_CRON ;
const options = {}

if (!MONGO_CONNECTION_STRING) {
    throw new Error('Please add MONGO_CONNECTION_STRING to your .env')
}

if (!SCHEDULED_CRON) {
    throw new Error('Please add SCHEDULED_CRON to your .env')
}

const client = new MongoClient(MONGO_CONNECTION_STRING, options)
const clientPromise = client.connect()

const task = cron.schedule(SCHEDULED_CRON, () => {
    console.log('ranking job ', new Date().toISOString());
    runRank();
    
  }, {
    scheduled: true,
  });

  
  async function runRank() {
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
  
      const rankedAgents = await rankAgents(pvpProfiles);
      await writePvPProfiles(rankedAgents);
  }
  
  async function rankAgents(pvpProfiles: WithId<PvPProfile>[]) {
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
          unrankedProfile.lastRankTime = new Date().getTime();
          console.log('persisting pvp profiles', getProfileKey(unrankedProfile));
          await writePvPProfiles(pvpProfiles);
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
      let p1Result:'win' | 'loss' | 'draw', p2Result: 'win' | 'loss' | 'draw';
      if(p1FinalHp == p2FinalHp) {
            p1Result = 'draw';
            p2Result = 'draw';
      }else{
            p1Result = beatAgent ? 'win' : 'loss';
            p2Result = beatAgent ? 'loss' : 'win';
      }
      return [
          { result: p1Result, score: p1FinalHp, hp: p1FinalHp },
          { result: p2Result, score: p2FinalHp, hp: p2FinalHp },
      ];
  }
  
  async function runSimulation(
      p1: Agent.default,
      p2: Agent.default
  ): Promise<[FrameScene, Error]> {
      let shoshinInput = new Int32Array(agentsToArray(p1, p2));
      let output = wasm.runCairoProgram(shoshinInput);
      return [cairoOutputToFrameScene.default(output), null];
  }
  
  function getAgentFromProfile(profile: PvPProfile): Agent.default {
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
  
  async function writePvPProfiles(pvpProfiles: WithId<PvPProfile>[]) {
      
      const client: MongoClient = await clientPromise;
      const db = client.db(DB_NAME);
  
      const pvpProfileCollection = db.collection<PvPProfile>(COLLECTION_NAME_PVP);
      const bulkUpdate = generateBulkUpdate(pvpProfiles);
      await pvpProfileCollection.bulkWrite(bulkUpdate);
  }