import { Slider, styled } from "@mui/material";

const Timeline = styled(Slider)(({ theme, color }) => ({
    color: color ? theme.palette[color].main : theme.palette.accent.main,
    height: 2,
    "&.MuiSlider-marked": {
        marginBottom: 0,
    },
    "& .MuiSlider-rail": {
        backgroundColor: "#d8d8d8",
    },
    "& .MuiSlider-thumb": {
        display: "none",
    },
    "& .MuiSlider-mark": {
        display: "none",
    },
    "& .MuiSlider-markLabel": {
        top: "50%",
        transform: "translate(-50%, -50%)",
    }
}));

export default Timeline;
