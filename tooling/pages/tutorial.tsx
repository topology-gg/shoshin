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
import { OPERATOR_TYPES } from "../src/types/Operator"

export default function Tutorial() {
    const FORMULA_LI_STYLE: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: "1rem",
    };
    const CONTENT_LI_STYLE: CSSProperties = {
        marginTop: "0.5rem",
    };

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // OPERATOR_TYPES.STIR.symbol


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
                        <li style={CONTENT_LI_STYLE}>
                            Layer 1 blockchains assert identity by capital contribution - pay to mint. Layer 2 blockchains, with new affordance in compute capacity, would assert identity by skill verification - solve to mint.
                        </li>
                        <li style={CONTENT_LI_STYLE}>
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
                        <li style={CONTENT_LI_STYLE}>
                            Only Singleton mechanism ("mech") is available,
                            whose instruction set is [<strong>W</strong>,<strong>A</strong>,<strong>S</strong>,<strong>D</strong>] for movement, <strong>Z</strong> for pick-up, <strong>X</strong> for drop, <strong>G</strong> for block-until-pick-up, and <strong>H</strong> for block-until-drop
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            More on <strong>G</strong>: the mech will wait at this instruction until its location has a free atom to be picked up.
                            It then picks up the free atom in the same frame, and proceed to its next instruction in the next frame.
                            If the mech is closed when encountering this instruction (i.e. not able to pick up), this instruction is treated as no-op.
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            More on <strong>H</strong>: the mech will wait at this instruction until its location is empty for drop-off.
                            It then drops off the atom in possession in the same frame, and proceed to its next instruction in the next frame.
                            If the mech is open when encountering this instruction (i.e. not possessing an atom for drop-off), this instruction is treated as no-op.
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            _ as instruction means no-operation.
                        </li>
                        <li style={CONTENT_LI_STYLE}>
                            During simulation, each mech cycles through its own
                            program (sequence of instructions) on repeat.
                        </li>
                        <li style={CONTENT_LI_STYLE}>
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
                            {OPERATOR_TYPES.STIR.symbol}(
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                            )
                            <p style={{marginLeft:'0.5rem', marginRight:'0.5rem'}}>=</p>
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                        </li>

                        <li style={FORMULA_LI_STYLE}>
                            <p className={styles.input_name}>{'Shake'}</p>
                            {OPERATOR_TYPES.SHAKE.symbol}(
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                            )
                            <p style={{marginLeft:'0.5rem', marginRight:'0.5rem'}}>=</p>
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_CHOCOLATE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                        </li>

                        <li style={FORMULA_LI_STYLE}>
                            <p className={styles.input_name}>{'Steam'}</p>
                            {OPERATOR_TYPES.STEAM.symbol}(
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_HAZELNUT_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_CHOCOLATE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_CHOCOLATE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                            )
                            <p style={{marginLeft:'0.5rem', marginRight:'0.5rem'}}>=</p>
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_TRUFFLE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />{" "}
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />

                        </li>

                        <li style={FORMULA_LI_STYLE}>
                            <p className={styles.input_name}>{'Smash'}</p>
                            {OPERATOR_TYPES.SMASH.symbol}(
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_TRUFFLE_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                            )
                            <p style={{marginLeft:'0.5rem', marginRight:'0.5rem'}}>=</p>
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />{" "}
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                            {" "}
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />{" "}
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_VANILLA_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                            ,
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_SAFFRON_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />

                        </li>

                    </ol>

                    <p
                        style={{
                            fontSize: "0.9rem",
                            marginTop: "0",
                            marginBottom: "0",
                        }}
                    >
                        Goal
                    </p>
                    <ol
                        style={{
                            width: "30rem",
                            marginTop: "0.5rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <li style={FORMULA_LI_STYLE}>
                            Deliver
                            <Unit
                                state={{
                                    bg_status: BgStatus.ATOM_SAFFRON_FREE,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null,
                                }}
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                            to Sink.
                        </li>
                        <li style={FORMULA_LI_STYLE}>
                            Minimize the latency and cost of your solution.
                        </li>
                    </ol>
                </Box>
            </Modal>
        </div>
    );
}
