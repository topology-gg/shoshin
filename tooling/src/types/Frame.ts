
export interface BodyState {
    dir: number,
    integrity: number,
    stamina: number,
    state: number,
    counter: number,
    fatigued: number,
}
const BODY_STATE_KEYS: (keyof BodyState)[] = ['dir', 'integrity', 'stamina', 'state', 'counter', 'fatigued']

export interface Vec2 {
    x: number,
    y: number,
}
const VEC2_KEYS: (keyof Vec2)[] = ['x', 'y']

export interface Rectangle {
    origin: Vec2,
    dimension: Vec2,
}

export interface PhysicsState {
    pos: Vec2,
    vel_fp: Vec2,
    acc_fp: Vec2,
}
const PHYSICS_STATE_KEYS: (keyof PhysicsState)[] = ['pos', 'vel_fp', 'acc_fp']

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

export interface Frame {
    mental_state: number,
    body_state: BodyState,
    physics_state: PhysicsState,
    action: number,
    stimulus: number,
    hitboxes: Hitboxes,
    combo: Combo
}

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

function getFlattenedPhysicState(physicState: PhysicsState): number[] {
    let flattenedPhysicState = []

    for (const key of PHYSICS_STATE_KEYS) {
        let vector: Vec2 = physicState[key]
        let flattenedVector = getFlattenedVector(vector)

        flattenedPhysicState.push(...flattenedVector)
    }

    return flattenedPhysicState
}

function getFlattenedVector(vector: Vec2): number[] {
    let flattenedVector = []

    for (const key of VEC2_KEYS) {
        flattenedVector.push(vector[key])
    }

    return flattenedVector
}

function getFlattenedBodyState(bodyState: BodyState): number[] {
    let flattenedBodyState = []

    for (const key of BODY_STATE_KEYS) {
        flattenedBodyState.push(bodyState[key])
    }

    return flattenedBodyState
}