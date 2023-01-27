import { Box, LinearProgress } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { spriteData } from "../constants/sprites";

function allImages() {
    return Object.keys(spriteData).flatMap((character) =>
        Object.keys(spriteData[character]).flatMap((state) =>
            ["left", "right"].map(
                (direction) =>
                    `./images/${character}/${state}/${direction}_spritesheet.png`
            )
        )
    );
}

const ImagePreloader = ({ onComplete }: { onComplete: () => void }) => {
    const [loaded, setLoaded] = useState<number>(0);
    const images = useMemo(() => {
        return allImages();
    }, []);

    useEffect(() => {
        images.forEach((image) => {
            const img = new Image();
            img.src = image;
            img.onload = () => setLoaded((prev) => prev + 1);
        });
    }, [images]);

    const allLoaded: boolean = loaded === images.length;

    useEffect(() => {
        if (allLoaded) {
            onComplete?.();
        }
    }, [allLoaded]);

    return (
        <>
            {!allLoaded && (
                <>
                    <div>Loading images...</div>
                    <Box sx={{ width: "50%" }}>
                        <LinearProgress
                            variant="determinate"
                            value={(loaded / images.length) * 100}
                        />
                    </Box>
                </>
            )}
        </>
    );
};

export default ImagePreloader;
