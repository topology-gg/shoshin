
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
    let physicStateKeys = Object.keys(physicState)

    for (const key of physicStateKeys) {
        let vector: Vec2 = physicState[key as keyof PhysicsState]
        let flattenedVector = getFlattenedVector(vector)

        flattenedPhysicState.push(...flattenedVector)
    }

    return flattenedPhysicState
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
    let flattenedBodyState = []
    let bodyStateKeys = Object.keys(bodyState)

    for (const key of bodyStateKeys) {
        flattenedBodyState.push(bodyState[key as keyof BodyState])
    }

    return flattenedBodyState
}