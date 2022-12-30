
export interface BodyState {
    state: number,
    counter: number,
    integrity: number,
    stamina: number,
    dir: number,
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

export interface Frame {
    mental_state: number,
    body_state: BodyState,
    physics_state: PhysicsState,
    action: number,
    stimulus: number,
    hitboxes: Hitboxes,
}

export interface TestJson {
    agent_0: Frame[],
    agent_1: Frame[],
}

// From Cairo:
// struct Frame {
//     mental_state: felt,
//     body_state: BodyState,
//     physics_state: PhysicsState,
//     action: felt,
//     stimulus: felt,
//     hitboxes: Hitboxes,
// }

// struct Hitboxes {
//     action: Rectangle,
//     body: Rectangle,
// }

// struct BodyState {
//     state: felt,
//     counter: felt,
//     integrity: felt,
//     stamina: felt,
//     dir: felt,
// }

// struct PhysicsState {
//     pos: Vec2,
//     vel_fp: Vec2,
//     acc_fp: Vec2,
// }

// struct Vec2 {
//     x: felt,
//     y: felt,
// }

// struct Rectangle {
//     origin: Vec2,
//     dimension: Vec2,
// }
