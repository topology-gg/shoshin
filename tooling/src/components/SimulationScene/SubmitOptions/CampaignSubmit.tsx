import { useEffect, useState } from 'react';
import { Opponent, Opponent, SavedMind } from '../../../types/Opponent';
import { useSubmitCampaignMind, useUpdateMind } from '../../../../lib/api';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip,
} from '@mui/material';
import ConnectWallet from '../../ConnectWallet';
import { useAccount } from '@starknet-react/core';
import { PlayerAgent } from '../../../types/Agent';

interface CampaignSubmitButtonProps {
    mind: PlayerAgent;
    opponentIndex: number;
    opponent: Opponent;
}

interface SubmittingProps extends CampaignSubmitButtonProps {
    handleLoaded: () => void;
}
const Submitting = ({ mind, opponentIndex, handleLoaded }: SubmittingProps) => {
    const res = useSubmitCampaignMind(opponentIndex, mind);

    useEffect(() => {
        if (res) {
            handleLoaded();
        }
    }, [res]);
    return (
        <Button>
            <CircularProgress size={24} />
        </Button>
    );
};

enum CampaignSubmitStage {
    WALLET_AUTH,
    CONFIRM,
    LOADING,
    SUCCESS,
}
const CampaignSubmitButton = ({
    mind,
    opponentIndex,
    opponent,
}: CampaignSubmitButtonProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [namingOpen, setNamingOpen] = useState<boolean>(false);

    const { address } = useAccount();

    const [stage, setStage] = useState<CampaignSubmitStage>(
        !address ? CampaignSubmitStage.WALLET_AUTH : CampaignSubmitStage.CONFIRM
    );

    const handleLoaded = () => {
        setLoading(false);
        setStage(CampaignSubmitStage.SUCCESS);
    };
    return (
        <Tooltip title={'Submit to fight against other players'}>
            <div>
                <Button
                    variant="outlined"
                    disabled={loading}
                    onClick={() => setNamingOpen(true)}
                ></Button>

                <Dialog
                    open={namingOpen}
                    onClose={() => setNamingOpen(false)}
                    fullWidth
                    maxWidth={'md'}
                >
                    {CampaignSubmitStage.WALLET_AUTH && (
                        <div>
                            <DialogTitle>Connect StarkNet Wallet</DialogTitle>
                            <DialogContent>
                                {!address ? (
                                    <ConnectWallet />
                                ) : (
                                    'Address ' + address
                                )}
                            </DialogContent>
                        </div>
                    )}

                    {CampaignSubmitStage.CONFIRM && (
                        <div>
                            <DialogTitle>Submit Agent</DialogTitle>
                            <DialogContent>Address : {address}</DialogContent>
                        </div>
                    )}

                    {CampaignSubmitStage.LOADING && (
                        <Submitting
                            mind={mind}
                            opponentIndex={opponentIndex}
                            handleLoaded={handleLoaded}
                        />
                    )}

                    {CampaignSubmitStage.SUCCESS && <div>Mind Submitted</div>}

                    <DialogActions>
                        <Button
                            onClick={() => setNamingOpen(false)}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                setLoading(true);
                                setNamingOpen(false);
                            }}
                            color="primary"
                            variant="contained"
                            disabled={!address}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Tooltip>
    );
};

export default CampaignSubmitButton;
