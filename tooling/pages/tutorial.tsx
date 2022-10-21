import Unit from "./unit";
import UnitState, {
    BgStatus,
    BorderStatus,
    UnitText,
} from "../src/types/UnitState";
import { CSSProperties, useState } from "react";
import Modal from "../src/components/Modal";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import styles from '../styles/Home.module.css'

export default function Tutorial() {
    const FORMULA_LI_STYLE: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    };

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div
            style={{
                marginBottom: "2rem",
            }}
        >
            <Button variant="outlined" onClick={handleOpen}>
                How to play
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ p: 2, fontFamily: "var(--font-family-secondary)" }}>
                <p
                        style={{
                            fontSize: "0.9rem",
                            marginTop: "0",
                            marginBottom: "0",
                        }}
                    >
                        Thesis & Theme
                    </p>
                    <ol
                        style={{
                            width: "30rem",
                            marginTop: "0.5rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <li>
                            Layer 1 blockchains assert identity by capital contribution - pay to mint. Layer 2 blockchains, with new affordance in compute capacity, would assert identity by skill verification - solve to mint.
                        </li>
                        <li>
                            MovyMovy is a puzzle about visual & parallel assembly programming. Place & program the little robots ("mechs"), and place the operators that execute formulas, to transport & transmute flavorful atoms from Faucet to Sink. Solutions are ranked by throughput and cost.
                        </li>
                    </ol>

                    <p
                        style={{
                            fontSize: "0.9rem",
                            marginTop: "0",
                            marginBottom: "0",
                        }}
                    >
                        Instructions
                    </p>
                    <ol
                        style={{
                            width: "30rem",
                            marginTop: "0.5rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <li>
                            Only Singleton mechanism ("mech") is available,
                            whose instruction set is [W,A,S,D] for movement, Z
                            for pick-up, X for put-down.
                        </li>
                        <li>_ as instruction means no-operation.</li>
                        <li>
                            During simulation, each mech cycles through its own
                            program (sequence of instructions) on repeat.
                        </li>
                        <li>
                            On operator placement: operands and product must be
                            contiguous grids i.e. for a+b=c, a&b and b&c must
                            both be neighbors. When the contiguity rule is
                            violated, operator symbols are not rendered.
                        </li>
                    </ol>

                    <p
                        style={{
                            fontSize: "0.9rem",
                            marginTop: "0",
                            marginBottom: "0",
                        }}
                    >
                        Formula list
                    </p>
                    <ol
                        style={{
                            width: "30rem",
                            marginTop: "0.5rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <li style={FORMULA_LI_STYLE}>
                            <p className={styles.input_name}>{'Stir'}</p>
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                            />{" "}
                            &
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                            />{" "}
                            =
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                            />
                        </li>

                        <li style={FORMULA_LI_STYLE}>
                            <p className={styles.input_name}>{'Shake'}</p>
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                            />{" "}
                            %
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                            />{" "}
                            =
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_CHOCOLATE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                            />
                        </li>

                        <li style={FORMULA_LI_STYLE}>
                            <p className={styles.input_name}>{'Steam'}</p>
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                            />{" "}
                            ~
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_CHOCOLATE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                            />{" "}
                            ~
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_CHOCOLATE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                            />
                            {" "}
                            =
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_TRUFFLE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                            />{" "}
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                            />

                        </li>
                    </ol>
                </Box>
            </Modal>
        </div>
    );
}
