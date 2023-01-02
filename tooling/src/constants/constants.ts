
export const SIMULATOR_W = 1000
export const SIMULATOR_H = 300

export const bodyStateNumberToName = {
    'jessica':{
        0: 'idle',
        10: 'slash',
        20: 'upswing',
        30: 'sidecut',
        40: 'block',
        50: 'clash',
        60: 'hurt',
        70: 'knocked',
        90: 'walk_forward',
        100: 'walk_backward',
        110: 'dash_forward',
        120: 'dash_backward',

        // namespace ns_jessica_body_state {
        //     const IDLE = 0; // 5 frames
        //     const SLASH = 10; // 5 frames
        //     const UPSWING = 20;  // 5 frames
        //     const SIDECUT = 30;  // 5 frames
        //     const BLOCK = 40; // 3 frames
        //     const CLASH = 50; // 4 frames;
        //     const HURT = 60; // 3 frames
        //     const KNOCKED = 70; // 11 frames
        //     const MOVE_FORWARD = 90;  // 8 frames
        //     const MOVE_BACKWARD = 100;  // 6 frames
        //     const DASH_FORWARD = 110;  // 5 frames
        //     const DASH_BACKWARD = 120;  // 5 frames
        // }
    },
    'antoc': {
        0: 'idle',
        10: 'hori',
        20: 'vert',
        40: 'block',
        50: 'hurt',
        60: 'knocked',
        90: 'walk_forward',
        100: 'walk_backward',
        110: 'dash_forward',
        120: 'dash_backward',

        // namespace ns_antoc_body_state {
        //     const IDLE = 0;      // 5 frames
        //     const HORI = 10;     // 7 frames
        //     const VERT = 20;  // 10 frames
        //     const BLOCK = 40;    // 6 frames
        //     const HURT = 50;     // 3 frames
        //     const KNOCKED = 60;  // 20 frames
        //     const MOVE_FORWARD = 90;  // 7 frames
        //     const MOVE_BACKWARD = 100;  // 6 frames
        //     const DASH_FORWARD = 110;  // 9 frames
        //     const DASH_BACKWARD = 120;  // 9 frames
        // }
    }

}

export const adjustmentForCharacter = (characterName: string, bodyStateName: string, bodyStateDir: string) => {
    if (characterName == 'jessica') {

        // calculate top adjustment
        const top = !(bodyStateName in ['dash_forward', 'dash_backward']) ? 8 : 0;

        // calculate left adjustment
        var left = 0;
        if (bodyStateDir == 'left') {
            left = -25

            if (bodyStateName == 'hurt') { left -= 20; }
            else if (bodyStateName == 'sidecut') { left -= 25; }
        }
        else {
            // facing right
            if (bodyStateName == 'sidecut') { left -= 55; }
            else if (bodyStateName == 'upswing') { left -= 45; }
            else { left = -29; }
        }

        return {'top': top, 'left':left};
    }
    else if (characterName == 'antoc') {

        const top = 13;

        var left = 0;
        if (bodyStateDir == 'left') {
            if (bodyStateName == 'idle'){ left -= 22; }
            else if ( ['hori', 'vert', 'block'].includes(bodyStateName) ){ left -= 180; }
        }
        return {'left':left, 'top':top}
    }

    // todo: Antoc adjustment
    return {'left':0, 'top':0}
}