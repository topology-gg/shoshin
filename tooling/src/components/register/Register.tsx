import React, { useEffect } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box, Button, Card, CardContent } from '@mui/material';
import { useAccount } from '@starknet-react/core';
import ConnectWallet from '../ConnectWallet';
import styles from './register.module.css';
import { useWhitelist } from '../../../lib/api';
import { WhitelistUser } from '../../../pages/api/whitelist/whitelist';

interface RegistrationProps {
    setIsWhiteListedTrue: () => void;
}

const hexstringToNumber = (hexstr: string): number => {
    const num = parseInt(hexstr.replace(/^#/, ''), 16);
    return num;
};
const matchHexstringsByNumber = (hexstr1: string, hexstr2: string): boolean => {
    return hexstringToNumber(hexstr1) == hexstringToNumber(hexstr2);
};

const RegistrationPage = ({ setIsWhiteListedTrue }: RegistrationProps) => {
    const { address } = useAccount();

    const { data: users } = useWhitelist();

    useEffect(() => {
        if (users !== undefined) {
            let match = !address
                ? -1
                : (users as WhitelistUser[]).findIndex((user) =>
                      matchHexstringsByNumber(user.address, address)
                  );
            if (match != -1) {
                setIsWhiteListedTrue();
            }
        }
    }, [address, users]);

    const displayWhitelistError =
        users?.find(
            (whitelistUser: WhitelistUser) => whitelistUser.address == address
        ) == undefined && address;
    const whiteListErrorMessage = address
        ? `Account with address ${address} \n is not whitelisted. If you believe there is an error please contact us directly`
        : '';

    const copyAddress = () => {
        navigator.clipboard.writeText(address);
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <div className={styles.imageContainer}>
                <img
                    className={styles.splashImage}
                    src="./images/splash/shoshin-title.jpg"
                />
            </div>
            <Card sx={{ maxWidth: 400, margin: '20px' }}>
                <CardContent>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ textAlign: 'center' }}
                    >
                        Shoshin is in early access
                    </Typography>
                    <br />
                    If you would like to join in playtesting, please{' '}
                    <Link
                        href="https://docs.google.com/forms/d/e/1FAIpQLSeEwahfkKqcX5eec-6vgnZF-61DcM5gIau_z2JoCNybuARE9Q/viewform"
                        target="_blank"
                        rel="noopener"
                    >
                        fill out this form
                    </Link>
                    .
                    <br />
                    <br />
                    Whitelisted players can connect to Shoshin below
                    <Typography
                        component="div"
                        sx={{ color: 'red' }}
                        overflow={'auto'}
                        paragraph={true}
                        flexDirection={'column'}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                wordBreak: 'break-word',
                            }}
                        >
                            {displayWhitelistError
                                ? whiteListErrorMessage
                                : null}
                            {displayWhitelistError ? (
                                <Button onClick={copyAddress}>
                                    Copy Address
                                </Button>
                            ) : null}
                        </div>
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '20px',
                        }}
                    >
                        <ConnectWallet />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default RegistrationPage;
