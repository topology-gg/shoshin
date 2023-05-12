
export interface BodyState {
    dir: number,
    integrity: number,
    stamina: number,
    state: number,
    counter: number,
    fatigued: number,
}

export interface Vec2 {
    x: number,
    y: number,
}

export interface Rectangle {
    origin: Vec2,
    dimension: Vec2,
}

export interface PhysicsState {
    pos: Vec2,
    vel_fp: Vec2,
    acc_fp: Vec2,
}

export interface Hitboxes {
    action: Rectangle,
    body: Rectangle,
}

export interface Combo {
    combo_index: number,
    action_index: number,
}

export interface FrameScene {
    agent_0: Frame[],
    agent_1: Frame[],
}

interface ComboInfo {
    current_combo : number,
    combo_counter : number
}

export interface RealTimeAgent {
    body_state: BodyState,
    physics_state: PhysicsState,
    stimulus: number,
    hitboxes: Hitboxes,
    mental_state: number,
    combo_info : ComboInfo
}

export interface RealTimePlayer {
    body_state: BodyState,
    physics_state: PhysicsState,
    stimulus: number,
    hitboxes: Hitboxes,
}

export interface RealTimeFrameScene {
    agent_0: RealTimePlayer,
    agent_1: RealTimeAgent,
}

export interface Frame {
    mental_state: number,
    body_state: BodyState,
    physics_state: PhysicsState,
    action: number,
    stimulus: number,
    hitboxes: Hitboxes,
    combo: Combo
}

export type FrameLike = Frame | RealTimePlayer | RealTimeAgent

export interface TestJson {
    agent_0: {
        frames: Frame[],
        type: number,
    }
    agent_1: {
        frames: Frame[],
        type: number,
    }
}

export function getFlattenedPerceptiblesFromFrame(agent: Frame): number[] {
    return [...getFlattenedPhysicState(agent.physics_state), ...getFlattenedBodyState(agent.body_state)]
}



function getFlattenedRectangle(rectangle : Rectangle) : number[]{
    let flattenedRectangle = []

    let rectangleKeys = Object.keys(rectangle)

    for (const key of rectangleKeys){
        let vector = rectangle[key as keyof Rectangle]

        let flattenedVector = getFlattenedVector(vector)

        flattenedRectangle.push(...flattenedVector)

    }

    return flattenedRectangle

}
function getFlattenedHitboxes(hitboxes : Hitboxes) : number[] {
    let flattenedHitboxes = []

    let hitboxesKeys = Object.keys(hitboxes)

    for (const key of hitboxesKeys){
        let rectangle = hitboxes[key as keyof Hitboxes]

        let flatteneRectangle = getFlattenedRectangle(rectangle)

        flattenedHitboxes.push(flatteneRectangle)
    }


    return flattenedHitboxes
}

function getFlattenedPhysicState(physicState: PhysicsState): number[] {
    let flattenedPhysicState = []
    let physicStateKeys = Object.keys(physicState)

    for (const key of physicStateKeys) {
        let vector: Vec2 = physicState[key as keyof PhysicsState]
        let flattenedVector = getFlattenedVector(vector)

        flattenedPhysicState.push(...flattenedVector)
    }

    return [
        ...getFlattenedVector(physicState.pos),
        ...getFlattenedVector(physicState.vel_fp),
        ...getFlattenedVector(physicState.acc_fp),
    ]
}

function getFlattenedVector(vector: Vec2): number[] {
    let flattenedVector = []
    let vectorKeys = Object.keys(vector)

    for (const key of vectorKeys) {
        flattenedVector.push(vector[key as keyof Vec2])
    }

    return flattenedVector
}

function getFlattenedBodyState(bodyState: BodyState): number[] {

    return [
        bodyState.state,
        bodyState.counter,
        bodyState.integrity,
        bodyState.stamina,
        bodyState.dir,
        bodyState.fatigued
    ]
}

//Ordering of elements in array are important, they much match what is in the rust and cairo code
export function realTimeInputToArray(
    scene : RealTimeFrameScene,
    player_action : number,
    character_type_0 : number,
    character_type_1 : number) : number[]{


    let flatBody_0 = getFlattenedBodyState(scene.agent_0.body_state)
    let flatBody_1 = getFlattenedBodyState(scene.agent_1.body_state)

    let flatPhysics_0 = getFlattenedPhysicState(scene.agent_0.physics_state)
    let flatPhysics_1 = getFlattenedPhysicState(scene.agent_1.physics_state)

    return [
        ...flatBody_0,
        ...flatPhysics_0,
        scene.agent_0.stimulus,
        player_action,
        character_type_0,
        ...flatBody_1,
        ...flatPhysics_1,
        scene.agent_1.stimulus,
        character_type_1
    ]
}

function countKeys(obj: any): number {
    let count = 0;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            count++;
            if (typeof obj[key] === 'object') {
                count += countKeys(obj[key]);
            }
        }
    }
    return count;
}


export function getSizeOfRealTimeInputScene(){
    let temp : RealTimeFrameScene = {
        agent_0 : {
            body_state : {
                dir : 1,
                stamina : 1,
                integrity  : 1,
                state: 1,
                fatigued: 1,
                counter: 1,
            },
            physics_state : {
                pos : {
                    x : 1,
                    y : 1,
                },
                vel_fp: {
                    x : 1,
                    y : 1,
                },
                acc_fp: {
                    x : 1,
                    y : 1,
                },
            },
            hitboxes : {
                action : {
                    origin : {
                        x : 1,
                        y : 1,
                    },
                    dimension : {
                        x : 1,
                        y : 1,
                    }
                },
                body : {
                    origin : {
                        x : 1,
                        y : 1,
                    },
                    dimension : {
                        x : 1,
                        y : 1,
                    }
                }
            },
            stimulus : 1
        },
        agent_1 : {
            body_state : {
                dir : 1,
                stamina : 1,
                integrity  : 1,
                state: 1,
                fatigued: 1,
                counter: 1,
            },
            physics_state : {
                pos : {
                    x : 1,
                    y : 1,
                },
                vel_fp: {
                    x : 1,
                    y : 1,
                },
                acc_fp: {
                    x : 1,
                    y : 1,
                },
            },
            hitboxes : {
                action : {
                    origin : {
                        x : 1,
                        y : 1,
                    },
                    dimension : {
                        x : 1,
                        y : 1,
                    }
                },
                body : {
                    origin : {
                        x : 1,
                        y : 1,
                    },
                    dimension : {
                        x : 1,
                        y : 1,
                    }
                }
            },
            stimulus : 1,
            mental_state : 1,
            combo_info : {
                combo_counter : 0,
                current_combo : 0
            }
        }
    }
}