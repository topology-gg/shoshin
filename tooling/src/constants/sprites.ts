export type SpriteData = {
    size: [number, number];
    hitboxOffset: { left: [number, number]; right: [number, number] };
};

export const spriteData: Record<string, Record<string, SpriteData>> = {
    antoc: {
        idle: {
            size: [180, 142],
            hitboxOffset: { left: [-22, 16], right: [-108, 16] },
        },
        hori: {
            size: [343, 239],
            hitboxOffset: { left: [-180, 16], right: [-108, 16] },
        },
    },
    jessica: {},
};
