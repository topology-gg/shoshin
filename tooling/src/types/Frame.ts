
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

export interface RealTimeFrameScene {
    agent_0: RealTimeFrame,
    agent_1: RealTimeFrame,
}
export interface RealTimeFrame {
    body_state: BodyState,
    physics_state: PhysicsState,
    action: number,
    stimulus: number,
    hitboxes: Hitboxes,
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

function realTimeFrameSceneToArray(scene : RealTimeFrameScene) : number[]{
    let flatBody_0 = getFlattenedBodyState(scene.agent_0.body_state)
    let flatBody_1 = getFlattenedBodyState(scene.agent_1.body_state)

    let flatPhysics_0 = getFlattenedPhysicState(scene.agent_0.physics_state)
    let flatPhysics_1 = getFlattenedPhysicState(scene.agent_1.physics_state)
    
    let flatHitbox_0 = getFlattenedHitboxes(scene.agent_0.hitboxes)
    let flatHitbox_1 = getFlattenedHitboxes(scene.agent_1.hitboxes)

    

    return [
        ...flatBody_0,
        ...flatPhysics_0,
        scene.agent_0.action,
        scene.agent_0.stimulus,
        ...flatHitbox_0,
        ...flatBody_1,
        ...flatPhysics_1,
        scene.agent_0.action,
        scene.agent_0.stimulus,
        ...flatHitbox_1,
    ]
}

export function realTimeInputToArray(
    scene : RealTimeFrameScene, 
    player_action : number, 
    character_type_0 : number, 
    character_type_1 : number) : number[]{

    return [...realTimeFrameSceneToArray(scene), player_action, character_type_0, character_type_1]
}


