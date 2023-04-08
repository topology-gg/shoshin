import { Slider, styled } from "@mui/material";

const Timeline = styled(Slider)(({ theme, color }) => ({
    color: color ? theme.palette[color].main : theme.palette.accent.main,
    height: 2,
    "& .MuiSlider-rail": {
        backgroundColor: "#d8d8d8",
    },
    "& .MuiSlider-thumb": {
        display: "none",
    },
    "& .MuiSlider-mark": {
        width: 10,
        height: 10,
        borderRadius: 10,
        transform: "translate(-50%, -50%)",
        "&.MuiSlider-markActive": {
            backgroundColor: "currentColor",
            opacity: 1,
        },
    },
    "& .MuiSlider-markLabel": {
        top: 20,
    }
}));

export default Timeline;
