import { useEffect, useState } from 'react';
import { Opponent, SavedMind } from '../../../types/Opponent';
import { useSubmitCampaignMind, useUpdateMind } from '../../../../lib/api';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip,
    Typography,
} from '@mui/material';
import ConnectWallet from '../../ConnectWallet';
import { useAccount } from '@starknet-react/core';
import { PlayerAgent } from '../../../types/Agent';

interface CampaignSubmitButtonProps {
    mind: PlayerAgent;
    opponentIndex: number;
    opponent: Opponent;
}

type SubmittingProps = Omit<CampaignSubmitButtonProps, 'opponent'> & {
    handleLoaded: () => void;
    address: string;
};

const Submitting = ({
    mind,
    opponentIndex,
    address,
    handleLoaded,
}: SubmittingProps) => {
    const res = useSubmitCampaignMind(opponentIndex, mind, address);

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

    const handleClose = () => {
        setNamingOpen(false);
        setStage(
            !address
                ? CampaignSubmitStage.WALLET_AUTH
                : CampaignSubmitStage.CONFIRM
        );
    };

    useEffect(() => {
        if (address) {
            setStage(CampaignSubmitStage.CONFIRM);
        }
    }, [address]);
    return (
        <Tooltip title={'Submit your mind to log your high score'}>
            <div>
                <Button
                    variant="outlined"
                    disabled={CampaignSubmitStage.LOADING == stage}
                    onClick={() => setNamingOpen(true)}
                >
                    Submit
                </Button>

                <Dialog
                    open={namingOpen}
                    onClose={() => setNamingOpen(false)}
                    fullWidth
                    maxWidth={'md'}
                >
                    {stage == CampaignSubmitStage.WALLET_AUTH && (
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

                    {stage == CampaignSubmitStage.CONFIRM && (
                        <div>
                            <DialogTitle>Submit Agent</DialogTitle>
                            <DialogContent>
                                Submitting as: {address} {'\n'}
                                <Typography>
                                    If you have already submitted a mind for
                                    this opponent. Your highest score will be
                                    reflected in the leaderboard.
                                </Typography>
                            </DialogContent>
                        </div>
                    )}

                    {stage == CampaignSubmitStage.LOADING && (
                        <Submitting
                            mind={mind}
                            opponentIndex={opponentIndex}
                            handleLoaded={handleLoaded}
                            address={address}
                        />
                    )}

                    {stage == CampaignSubmitStage.SUCCESS && (
                        <div>
                            <DialogTitle>Submit Agent</DialogTitle>
                            <DialogContent>
                                Mind submitted successfully!
                            </DialogContent>
                        </div>
                    )}

                    <DialogActions>
                        {stage !== CampaignSubmitStage.SUCCESS && (
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                        )}

                        {stage == CampaignSubmitStage.CONFIRM && (
                            <Button
                                onClick={() => {
                                    setStage(CampaignSubmitStage.LOADING);
                                }}
                                color="primary"
                                variant="contained"
                                disabled={!address}
                            >
                                Submit
                            </Button>
                        )}

                        {stage == CampaignSubmitStage.SUCCESS && (
                            <Button
                                onClick={handleClose}
                                color="primary"
                                variant="contained"
                                disabled={!address}
                            >
                                Close
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </div>
        </Tooltip>
    );
};

export default CampaignSubmitButton;
