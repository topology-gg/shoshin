
export const STATIC_COSTS:  {[key:string] : number} = {
    STIR:  250,
    SHAKE: 500,
    STEAM: 750,
    SMASH: 1000,
    SINGLETON: 150
}

export const DYNAMIC_COSTS: {[key:string] : number} = {
    SINGLETON_MOVE_EMPTY: 10,
    SINGLETON_MOVE_CARRY: 20,
    SINGLETON_GET: 25,
    SINGLETON_PUT: 25,
    SINGLETON_BLOCKED: 3,
}