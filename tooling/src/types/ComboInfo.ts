import {
    Action,
    DashBackward,
    DashForward,
    Slash,
    Upswing,
    Sidecut,
    Jump,
    JessicaLowKick,
    Vert,
    AntocJump,
    AntocDashForward,
    AntocDashBackward,
    StepForward,
    AntocLowKick,
} from './Action';
import { JESSICA, ANTOC } from '../constants/constants';

export interface ComboInfo {
    actions: Action[];
    character: number;
    displayName: string;
    video: string;
    description?: string;
}

//
// Jessica's combos
//

const DashForwardSlash: ComboInfo = {
    actions: [DashForward, Slash],
    character: 0,
    displayName: 'Dash Forward - Slash',
    video: './media/tutorial/jessica-dashforward-slash.mp4',
};

const DashBackwardSlash: ComboInfo = {
    actions: [DashBackward, Slash],
    character: 0,
    displayName: 'Dash Backward - Slash',
    video: './media/tutorial/jessica-dashbackward-slash.mp4',
};

const DashForwardUpswing: ComboInfo = {
    actions: [DashForward, Upswing],
    character: 0,
    displayName: 'Dash Forward - Upswing',
    video: './media/tutorial/jessica-dashforward-upswing.mp4',
};

const DashBackwardUpswing: ComboInfo = {
    actions: [DashBackward, Upswing],
    character: 0,
    displayName: 'Dash Backward - Upswing',
    video: './media/tutorial/jessica-dashbackward-upswing.mp4',
};

const DashForwardSidecut: ComboInfo = {
    actions: [DashForward, Sidecut],
    character: 0,
    displayName: 'Dash Forward - Sidecut',
    video: './media/tutorial/jessica-dashforward-sidecut.mp4',
};

const DashBackwardSidecut: ComboInfo = {
    actions: [DashBackward, Sidecut],
    character: 0,
    displayName: 'Dash Backward - Sidecut',
    video: './media/tutorial/jessica-dashbackward-sidecut.mp4',
};

const DashForwardJump: ComboInfo = {
    actions: [DashForward, Jump],
    character: 0,
    displayName: 'DashForward - Jump',
    video: './media/tutorial/jessica-dashforward-jump.mp4',
};

const DashBackwardJump: ComboInfo = {
    actions: [DashBackward, Jump],
    character: 0,
    displayName: 'DashBackward - Jump',
    video: './media/tutorial/jessica-dashbackward-jump.mp4',
};

const JumpDashForward: ComboInfo = {
    actions: [Jump, DashForward],
    character: 0,
    displayName: 'AirDash Forward',
    video: './media/tutorial/jessica-airdash-forward.mp4',
};

const JumpDashBackward: ComboInfo = {
    actions: [Jump, DashBackward],
    character: 0,
    displayName: 'AirDash Backward',
    video: './media/tutorial/jessica-airdash-backward.mp4',
};

const Birdswing: ComboInfo = {
    actions: [Jump, Sidecut],
    character: 0,
    displayName: 'Birdswing',
    video: './media/tutorial/jessica-birdswing.mp4',
};

const ForwardBirdswing: ComboInfo = {
    actions: [Jump, DashForward, Sidecut],
    character: 0,
    displayName: 'Forward Birdswing',
    video: './media/tutorial/jessica-forward-birdswing.mp4',
};

const BackwardBirdswing: ComboInfo = {
    actions: [Jump, DashBackward, Sidecut],
    character: 0,
    displayName: 'Backward Birdswing',
    video: './media/tutorial/jessica-backward-birdswing.mp4',
};

const LowKickUpswing: ComboInfo = {
    actions: [JessicaLowKick, Upswing],
    character: 0,
    displayName: 'LowKick - Upswing',
    video: './media/tutorial/jessica-lowkick-upswing.mp4',
};

const LowKickDashBackward: ComboInfo = {
    actions: [JessicaLowKick, DashBackward],
    character: 0,
    displayName: 'LowKick - DashBackward',
    video: './media/tutorial/jessica-lowkick-dashbackward.mp4',
};

export const comboInfosJessica = [
    DashForwardSlash,
    DashBackwardSlash,
    DashForwardUpswing,
    DashBackwardUpswing,
    DashForwardSidecut,
    DashBackwardSidecut,
    DashForwardJump,
    DashBackwardJump,
    JumpDashForward,
    JumpDashBackward,
    Birdswing,
    ForwardBirdswing,
    BackwardBirdswing,
    LowKickUpswing,
    LowKickDashBackward,
];

//
// Antoc's combos
//

const AntocDashForwardJump: ComboInfo = {
    actions: [AntocDashForward, AntocJump],
    character: ANTOC,
    displayName: 'DashForward Jump',
    video: './media/tutorial/antoc-dashforward-jump.mp4',
};

const AntocDashBackwardJump: ComboInfo = {
    actions: [AntocDashBackward, AntocJump],
    character: ANTOC,
    displayName: 'DashBackward Jump',
    video: './media/tutorial/antoc-dashbackward-jump.mp4',
};

const AntocJumpDashForward: ComboInfo = {
    actions: [AntocJump, AntocDashForward],
    character: ANTOC,
    displayName: 'AirDash Forward',
    video: './media/tutorial/antoc-airdash-forward.mp4',
};

const AntocJumpDashBackward: ComboInfo = {
    actions: [AntocJump, AntocDashBackward],
    character: ANTOC,
    displayName: 'AirDash Backward',
    video: './media/tutorial/antoc-airdash-backward.mp4',
};

const DropSlash: ComboInfo = {
    actions: [AntocJump, Vert],
    character: ANTOC,
    displayName: 'DropSlash',
    video: './media/tutorial/antoc-dropslash.mp4',
};

const ForwardDropSlash: ComboInfo = {
    actions: [AntocJump, AntocDashForward, Vert],
    character: ANTOC,
    displayName: 'Forward DropSlash',
    video: './media/tutorial/antoc-forward-dropslash.mp4',
};

const BackwardDropSlash: ComboInfo = {
    actions: [AntocJump, AntocDashBackward, Vert],
    character: ANTOC,
    displayName: 'Backward DropSlash',
    video: './media/tutorial/antoc-backward-dropslash.mp4',
};

const StepForwardLowKick: ComboInfo = {
    actions: [StepForward, AntocLowKick],
    character: ANTOC,
    displayName: 'StepForward LowKick',
    video: './media/tutorial/antoc-stepforward-lowkick.mp4',
};

const StepForwardVert: ComboInfo = {
    actions: [StepForward, Vert],
    character: ANTOC,
    displayName: 'StepForward Vert',
    video: './media/tutorial/antoc-stepforward-vert.mp4',
};

export const comboInfosAntoc = [
    AntocDashForwardJump,
    AntocDashBackwardJump,
    AntocJumpDashForward,
    AntocJumpDashBackward,
    DropSlash,
    ForwardDropSlash,
    BackwardDropSlash,
    StepForwardLowKick,
    StepForwardVert,
];
