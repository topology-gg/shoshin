export interface MentalState {
    state: string,
    action: number,
}

export enum Character {
    Jessica = 'Jessica',
    Antoc = 'Antoc',
}

export enum ActionsJessica {
    NULL = 0,
    SLASH = 1,
    UPSWING = 2,
    SIDECUT = 3,
    BLOCK = 4,
    MOVE_FORWARD  = 5,
    MOVE_BACKWARD = 6,
    DASH_FORWARD  = 7,
    DASH_BACKWARD = 8,
    COMBO = 10,
}

export enum ActionsAntoc {
    NULL = 0,
    HORI = 1,
    VERT = 2,
    BLOCK = 3,
    MOVE_FORWARD = 4,
    MOVE_BACKWARD = 5,
    DASH_FORWARD = 6,
    DASH_BACKWARD = 7,
    COMBO = 10,
}

export const charactersActions: any[] = [ActionsJessica, ActionsAntoc]
