import React, { useEffect } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Box, Card, CardContent } from "@mui/material";
import { useAccount } from "@starknet-react/core";
import ConnectWallet from "../ConnectWallet";
import styles from './register.module.css'

interface RegistrationProps {
    setIsWhiteListedTrue: () => void;
}

const whiteListedAccounts = [
    "0x266ed55be7054c74db3f8ec2e79c728056c802a11481fad0e91220139b8916a", // noncents
    "0x013d200c8c96561a8c0b20fe1782c79b83edd4608228006ec674e5528b47ad9e", // noncents cartridge
    "0x2f880133db4f533bDbC10C3d02fbC9b264dAC2Ff52EAE4E0cec0CE794bAD898", // gg
    "0x1b0afcd626d197993070994f8b37d20594c93bebfd48e28bd38c3b94a5802ea", // gg cartridge
    "0x013db223f1bb7c87bb36440fe1c1f01a7b32e6b4cfcadfe77dc0cd716c83a3f8" // xiler argent -x
];

const hexstringToNumber = (hexstr: string): number => {
    const num = parseInt(hexstr.replace(/^#/, ''), 16);
    return num;
}
const matchHexstringsByNumber = (hexstr1: string, hexstr2: string): boolean => {
    return hexstringToNumber(hexstr1) == hexstringToNumber(hexstr2);
}

const RegistrationPage = ({ setIsWhiteListedTrue }: RegistrationProps) => {
    const { address } = useAccount();

    useEffect(() => {
        let match = !address ? -1 : whiteListedAccounts.findIndex(
            (whitelistedAddress) => matchHexstringsByNumber(whitelistedAddress, address)
        );
        if (match != -1) {
            setIsWhiteListedTrue();
        }
    }, [address]);
    const displayWhitelistError =
        whiteListedAccounts.find(
            (whitelistedAddress) => whitelistedAddress == address
        ) == undefined;
    const whiteListErrorMessage = address
        ? `Account ${address}... is not whitelisted. If you believe there is an error please contact us directly`
        : "";

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <div className={styles.imageContainer}>
                <img
                    className={styles.splashImage}
                    src="./images/splash/shoshin-title.jpg"
                />
            </div>
            <Card sx={{ maxWidth: 400, margin: "20px" }}>
                <CardContent>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ textAlign: "center" }}
                    >
                        Shoshin is in early access
                    </Typography>
                    <br />
                    If you would like to join in playtesting, please{" "}
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
                    <Typography component="div" sx={{ color: "red" }}>
                        {displayWhitelistError ? whiteListErrorMessage : null}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
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
