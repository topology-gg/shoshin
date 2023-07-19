import { Action, DashBackward, DashForward, Slash } from './Action';

export interface ComboInfo {
    actions: Action[];
    character: number;
    displayName: string;
    video: string;
    description?: string;
}

const DashAndSlash: ComboInfo = {
    actions: [DashForward, Slash],
    character: 0,
    displayName: 'Dash and Slash',
    video: './media/tutorial/slash.mp4',
};

const DashAndSlashTwo: ComboInfo = {
    actions: [DashBackward, Slash],
    character: 0,
    displayName: 'Dash and Slash #2',
    video: './media/tutorial/slash.mp4',
};

export const comboInfosJessica = [DashAndSlash, DashAndSlashTwo];
