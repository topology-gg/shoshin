import { Icon, Tooltip } from '@mui/material';
import SubmitMindButton from './MainSceneSubmit';
import CampaignSubmitButton from './CampaignSubmit';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Playable } from '../../layout/SceneSelector';
import { Opponent } from '../../../types/Opponent';

interface SubmitOptionsProps {
    isPreview: boolean;
    isCampaign: boolean;
    player: Playable;
    opponentIndex: number;
    opponent: any;
}

const SubmitOptions = ({
    isPreview,
    isCampaign,
    player,
    opponentIndex,
    opponent,
}: SubmitOptionsProps) => {
    const isSavedMind = player !== undefined && 'createdDate' in player;
    const isPlayerAgent = player !== undefined && 'layers' in player;

    let saveMessage = '';

    if (isPreview) {
        saveMessage = `No changes saved in practice fight`;
    } else if (isSavedMind) {
        saveMessage = `Changes to ${player.mindName} are saved automatically`;
    } else {
        saveMessage = 'Changes to online minds are not saved';
    }

    return (
        <div>
            {!isPlayerAgent && !isCampaign && (
                <Tooltip title={saveMessage}>
                    <Icon aria-label="download">
                        {isSavedMind && !isPreview ? (
                            <FileDownloadIcon color="success" />
                        ) : (
                            <FileDownloadOffIcon />
                        )}
                    </Icon>
                </Tooltip>
            )}
            {isSavedMind && (
                <SubmitMindButton mind={player} username={player.playerName} />
            )}
            {isCampaign && isPlayerAgent && (
                <CampaignSubmitButton
                    mind={player}
                    opponentIndex={opponentIndex}
                    opponent={opponent}
                />
            )}
        </div>
    );
};

export default SubmitOptions;
