import { useEffect, useState } from 'react';
import { Opponent, SavedMind } from '../../../types/Opponent';
import { useSubmitCampaignMind, useUpdateMind } from '../../../../lib/api';
import {
    Box,
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
import ShoshinMenuButton from '../../ui/ShoshinMenuButton';
import {
    OnlineSubmitButtonDialogContent,
    SubmittingOnline,
} from './MainSceneSubmit';

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
    CHOOSE_SUBMIT,
    WALLET_AUTH,
    CONFIRM,
    LOADING,
    SUCCESS,
    ONLINE_SUBMIT,
}
const CampaignSubmitButton = ({
    mind,
    opponentIndex,
    opponent,
}: CampaignSubmitButtonProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [namingOpen, setNamingOpen] = useState<boolean>(false);
    const [onlineDalogOpen, setOnlineDialogOpen] = useState<boolean>(false);
    const [newMindName, setNewMindName] = useState<string>('');
    const [newAuthorName, setNewAuthorName] = useState<string>('');

    const { address } = useAccount();

    const [stage, setStage] = useState<CampaignSubmitStage>(
        CampaignSubmitStage.CHOOSE_SUBMIT
    );

    const handleCampaignSelect = () => {
        setStage(
            !address
                ? CampaignSubmitStage.WALLET_AUTH
                : CampaignSubmitStage.CONFIRM
        );
    };
    const handleLoaded = () => {
        setLoading(false);
        setStage(CampaignSubmitStage.SUCCESS);
    };

    const handleClose = () => {
        setNamingOpen(false);
        setStage(CampaignSubmitStage.CHOOSE_SUBMIT);
    };

    useEffect(() => {
        if (address) {
            setStage(CampaignSubmitStage.CONFIRM);
        }
    }, [address]);

    //@ts-ignore
    const onlineVersion: SavedMind = {
        agent: mind,
        mindName: newMindName,
        playerName: newAuthorName,
        createdDate: Date.now().toString(),
        rank: 9999999,
    };

    return (
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
                onClose={handleClose}
                fullWidth
                maxWidth={'md'}
            >
                {stage == CampaignSubmitStage.CHOOSE_SUBMIT && (
                    <div>
                        <DialogTitle>Choose Submit</DialogTitle>
                        <DialogContent>
                            Choose where to submit the mind
                            <Box display="flex">
                                <ShoshinMenuButton
                                    onClick={handleCampaignSelect}
                                >
                                    Campaign Leaderboard
                                </ShoshinMenuButton>
                                <ShoshinMenuButton
                                    onClick={() => {
                                        setStage(
                                            CampaignSubmitStage.ONLINE_SUBMIT
                                        );
                                    }}
                                >
                                    Online{' '}
                                </ShoshinMenuButton>
                            </Box>
                        </DialogContent>
                    </div>
                )}

                {stage == CampaignSubmitStage.ONLINE_SUBMIT && (
                    <OnlineSubmitButtonDialogContent
                        newMindName={newMindName}
                        setNewMindName={setNewMindName}
                        newAuthorName={newAuthorName}
                        setNewAuthorName={setNewAuthorName}
                    />
                )}

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
                                If you have already submitted a mind for this
                                opponent. Your highest score will be reflected
                                in the leaderboard.
                            </Typography>
                        </DialogContent>
                    </div>
                )}

                {stage == CampaignSubmitStage.LOADING && !loading && (
                    <Submitting
                        mind={mind}
                        opponentIndex={opponentIndex}
                        handleLoaded={handleLoaded}
                        address={address}
                    />
                )}

                {stage == CampaignSubmitStage.LOADING && loading && (
                    <SubmittingOnline
                        mind={onlineVersion}
                        username={newAuthorName}
                        handleLoaded={() => setLoading(false)}
                        newMindName={newMindName}
                        newAuthorName={newAuthorName}
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
                    {stage !== CampaignSubmitStage.SUCCESS &&
                        stage !== CampaignSubmitStage.ONLINE_SUBMIT && (
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

                    {stage == CampaignSubmitStage.ONLINE_SUBMIT && (
                        <div>
                            <DialogActions>
                                <Button
                                    onClick={() =>
                                        setStage(
                                            CampaignSubmitStage.CHOOSE_SUBMIT
                                        )
                                    }
                                    color="primary"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={() => {
                                        setLoading(true);
                                        setStage(CampaignSubmitStage.LOADING);
                                    }}
                                    color="primary"
                                    variant="contained"
                                >
                                    Confirm
                                </Button>
                            </DialogActions>
                        </div>
                    )}
                    {stage == CampaignSubmitStage.SUCCESS && (
                        <Button
                            onClick={handleClose}
                            color="primary"
                            variant="contained"
                        >
                            Close
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CampaignSubmitButton;
