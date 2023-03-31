export type SpriteData = {
    size: [number, number];
    hitboxOffset: { left: [number, number]; right: [number, number] };
};

export const spriteData: Record<string, Record<string, SpriteData[]>> = {
    antoc: {
        block: [
            {
                size: [343, 239],
                hitboxOffset: { left: [-177,15], right: [-114,16] },
            }
        ],
        dash_backward: [
            {
                size: [193, 142],
                hitboxOffset: { left: [-32,17], right: [-105,16] },
            }
        ],
        dash_forward: [
            {
                size: [193, 142],
                hitboxOffset: { left: [-32,17], right: [-111,18] },
            }
        ],
        hori: [
            {
                size: [343, 239],
                hitboxOffset: { left: [-187, 16], right: [-108, 16] },
            }
        ],
        idle: [
            {
                size: [180, 142],
                hitboxOffset: { left: [-22, 16], right: [-103, 16] },
            }
        ],
        knocked: [
            {
                size: [363, 217],
                hitboxOffset: { left: [-39,24], right: [-265,24] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-45,50], right: [-235,50] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-70,70], right: [-220,70] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-110,87], right: [-144,87] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-135,50], right: [-128,50] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-160,18], right: [-102,17] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-209,17], right: [-53,17] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-202,17], right: [-33,18] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-203,17], right: [-100,18] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-175,17], right: [-142,17] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-166,15], right: [-140,17] },
            }
        ],
        vert: [
            {
                size: [343, 239],
                hitboxOffset: { left: [-185,16], right: [-109,16] },
            }
        ],
        walk_backward: [
            {
                size: [185, 142],
                hitboxOffset: { left: [-36,18], right: [-98,18] },
            }
        ],
        walk_forward: [
            {
                size: [185, 142],
                hitboxOffset: { left: [-36,18], right: [-98,18] },
            }
        ],
        hurt: [
            {
                size: [187, 140],
                hitboxOffset: { left: [-34,0], right: [-97,0] },
            }
        ]
    },
    jessica: {
        block: [
            {
                size: [103, 126],
                hitboxOffset: { left: [-17,8], right: [-37, 8] },
            }
        ],
        clash: [
            {
                size: [132, 141],
                hitboxOffset: { left: [-31,9], right: [-53,3] },
            }
        ],
        dash_backward: [
            {
                size: [147, 106],
                hitboxOffset: { left: [0,0], right: [-21,0] },
            }
        ],
        dash_forward: [
            {
                size: [113, 104],
                hitboxOffset: { left: [0,0], right: [-21,0] },
            }
        ],
        hurt: [
            {
                size: [105, 142],
                hitboxOffset: { left: [-22,12], right: [-27,12] },
            }
        ],
        idle: [
            {
                size: [96, 126],
                hitboxOffset: { left: [-9,8], right: [-37,8] },
            }
        ],
        knocked: [
            {
                size: [261, 137],
                hitboxOffset: { left: [-11,8], right: [-180,8] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [-50,11], right: [-142,11] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [-110,6], right: [-50,6] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [-118,6], right: [-43,6] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [-118,6], right: [-43,6] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [-118,6], right: [-43,6] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [-118,6], right: [-43,6] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [-118,6], right: [-93,6] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [-118,6], right: [-90,6] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [-125,6], right: [-85,6] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [-121,6], right: [-90,6] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [0,0], right: [0,0] },
            },
        ],
        sidecut: [
            {
                size: [239, 141],
                hitboxOffset: { left: [-127,8], right: [-62,8] },
            }
        ],
        slash: [
            {
                size: [181, 183],
                hitboxOffset: { left: [-90,8], right: [-37,8] },
            }
        ],
        upswing: [
            {
                size: [205, 167],
                hitboxOffset: { left: [-102,8], right: [-52,8] },
            }
        ],
        walk_backward: [
            {
                size: [105, 142],
                hitboxOffset: { left: [-21,11], right: [-31,11] },
            }
        ],
        walk_forward: [
            {
                size: [105, 142],
                hitboxOffset: { left: [-21,11], right: [-31,11] },
            }
        ],
    },
};


export const spriteDataPhaser: Record<string, Record<string, SpriteData[]>> = {
    antoc: {
        block: [
            {
                size: [343, 239],
                hitboxOffset: { left: [20,-102], right: [80, -44] },
            }
        ],
        dash_backward: [
            {
                size: [193, 142],
                hitboxOffset: { left: [90,0], right: [11,0] },
            }
        ],
        dash_forward: [
            {
                size: [193, 142],
                hitboxOffset: { left: [90,0], right: [11,0] },
            }
        ],
        hori: [
            {
                size: [343, 239],
                hitboxOffset: { left: [10, -40], right: [90, -45] },
            }
        ],
        idle: [
            {
                size: [180, 142],
                hitboxOffset: { left: [92, -54], right: [0, -100] },
            }
        ],
        knocked: [
            {
                size: [363, 217],
                hitboxOffset: { left: [170,-20], right: [-70,-30] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [150,-20], right: [-20,-30] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [120,-20], right: [0,-30] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [80,-20], right: [40,-10] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [40,-20], right: [60,-20] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-0,-20], right: [80, -26] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-0,-20], right: [120,-20] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [-30,-20], right: [140,-20] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [10,-20], right: [100, -20] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [30,-20], right: [70,-20] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [40,-20], right: [60,-30] },
            }
        ],
        vert: [
            {
                size: [343, 239],
                hitboxOffset: { left: [10,-40], right: [90,-50] },
            }
        ],
        walk_backward: [
            {
                size: [185, 142],
                hitboxOffset: { left: [80,5], right: [20,5] },
            }
        ],
        walk_forward: [
            {
                size: [185, 142],
                hitboxOffset: { left: [80,5], right: [20,5] },
            }
        ],
        hurt: [
            {
                size: [187, 140],
                hitboxOffset: { left: [83,-69], right: [17,-10] },
            }
        ]
    },
    jessica: {
        block: [
            {
                size: [103, 126],
                hitboxOffset: { left: [61, 5], right: [52,-52] },
            }
        ],
        clash: [
            {
                size: [132, 141],
                hitboxOffset: { left: [65, -5], right: [35,-5] },
            }
        ],
        dash_backward: [
            {
                size: [147, 106],
                hitboxOffset: { left: [25, 5], right: [80,0] },
            }
        ],
        dash_forward: [
            {
                size: [113, 104],
                hitboxOffset: { left: [40, 10], right: [60,-50] },
            }
        ],
        hurt: [
            {
                size: [105, 142],
                hitboxOffset: { left: [55, 0], right: [40,0] },
            }
        ],
        idle: [
            {
                size: [96, 126],
                hitboxOffset: { left: [65, 5], right: [45,-53] },
            }
        ],
        knocked: [
            {
                size: [261, 137],
                hitboxOffset: { left: [110,0], right: [10,-55] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [70,0], right: [50,-55] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [70,0], right: [80,-20] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [40,0], right: [85,-10] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [50,0], right: [78,-10] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [50,0], right: [80,-10] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [50,0], right: [85,-9] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [40,0], right: [40,-10] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [40,0], right: [45,-20] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [40,0], right: [45,-30] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [40,0], right: [45,-47] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [0,0], right: [0,0] },
            },
        ],
        sidecut: [
            {
                size: [239, 141],
                hitboxOffset: { left: [20, 0], right: [80,-5] },
            }
        ],
        slash: [
            {
                size: [181, 183],
                hitboxOffset: { left: [25, -22], right: [80,-80] },
            }
        ],
        upswing: [
            {
                size: [205, 167],
                hitboxOffset: { left: [28, -20], right: [70,-15] },
            }
        ],
        walk_backward: [
            {
                size: [105, 142],
                hitboxOffset: { left: [56, 0], right: [40,0] },
            }
        ],
        walk_forward: [
            {
                size: [105, 142],
                hitboxOffset: { left: [56, 0], right: [40,0] },
            }
        ],
    },
};