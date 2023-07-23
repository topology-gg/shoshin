export type SpriteData = {
    size: [number, number];
    hitboxOffset: { left: [number, number]; right: [number, number] };
};

// export const spriteData: Record<string, Record<string, SpriteData[]>> = {
//     antoc: {
//         block: [
//             {
//                 size: [343, 239],
//                 hitboxOffset: { left: [-177, 15], right: [-114, 16] },
//             },
//         ],
//         dash_backward: [
//             {
//                 size: [193, 142],
//                 hitboxOffset: { left: [-32, 17], right: [-105, 16] },
//             },
//         ],
//         dash_forward: [
//             {
//                 size: [193, 142],
//                 hitboxOffset: { left: [-32, 17], right: [-111, 18] },
//             },
//         ],
//         hori: [
//             {
//                 size: [343, 239],
//                 hitboxOffset: { left: [-187, 16], right: [-108, 16] },
//             },
//         ],
//         idle: [
//             {
//                 size: [180, 142],
//                 hitboxOffset: { left: [-22, 16], right: [-103, 16] },
//             },
//         ],
//         knocked: [
//             {
//                 size: [363, 217],
//                 hitboxOffset: { left: [-39, 24], right: [-265, 24] },
//             },
//             {
//                 size: [363, 217],
//                 hitboxOffset: { left: [-45, 50], right: [-235, 50] },
//             },
//             {
//                 size: [363, 217],
//                 hitboxOffset: { left: [-70, 70], right: [-220, 70] },
//             },
//             {
//                 size: [363, 217],
//                 hitboxOffset: { left: [-110, 87], right: [-144, 87] },
//             },
//             {
//                 size: [363, 217],
//                 hitboxOffset: { left: [-135, 50], right: [-128, 50] },
//             },
//             {
//                 size: [363, 217],
//                 hitboxOffset: { left: [-160, 18], right: [-102, 17] },
//             },
//             {
//                 size: [363, 217],
//                 hitboxOffset: { left: [-209, 17], right: [-53, 17] },
//             },
//             {
//                 size: [363, 217],
//                 hitboxOffset: { left: [-202, 17], right: [-33, 18] },
//             },
//             {
//                 size: [363, 217],
//                 hitboxOffset: { left: [-203, 17], right: [-100, 18] },
//             },
//             {
//                 size: [363, 217],
//                 hitboxOffset: { left: [-175, 17], right: [-142, 17] },
//             },
//             {
//                 size: [363, 217],
//                 hitboxOffset: { left: [-166, 15], right: [-140, 17] },
//             },
//         ],
//         vert: [
//             {
//                 size: [343, 239],
//                 hitboxOffset: { left: [-185, 16], right: [-109, 16] },
//             },
//         ],
//         walk_backward: [
//             {
//                 size: [185, 142],
//                 hitboxOffset: { left: [-36, 18], right: [-98, 18] },
//             },
//         ],
//         walk_forward: [
//             {
//                 size: [185, 142],
//                 hitboxOffset: { left: [-36, 18], right: [-98, 18] },
//             },
//         ],
//         hurt: [
//             {
//                 size: [187, 140],
//                 hitboxOffset: { left: [-34, 0], right: [-97, 0] },
//             },
//         ],
//     },
//     jessica: {
//         block: [
//             {
//                 size: [103, 126],
//                 hitboxOffset: { left: [-17, 8], right: [-37, 8] },
//             },
//         ],
//         clash: [
//             {
//                 size: [132, 141],
//                 hitboxOffset: { left: [-31, 9], right: [-53, 3] },
//             },
//         ],
//         dash_backward: [
//             {
//                 size: [147, 106],
//                 hitboxOffset: { left: [0, 0], right: [-21, 0] },
//             },
//         ],
//         dash_forward: [
//             {
//                 size: [113, 104],
//                 hitboxOffset: { left: [0, 0], right: [-21, 0] },
//             },
//         ],
//         hurt: [
//             {
//                 size: [105, 142],
//                 hitboxOffset: { left: [-22, 12], right: [-27, 12] },
//             },
//         ],
//         idle: [
//             {
//                 size: [96, 126],
//                 hitboxOffset: { left: [-9, 8], right: [-37, 8] },
//             },
//         ],
//         knocked: [
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [-11, 8], right: [-180, 8] },
//             },
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [-50, 11], right: [-142, 11] },
//             },
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [-110, 6], right: [-50, 6] },
//             },
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [-118, 6], right: [-43, 6] },
//             },
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [-118, 6], right: [-43, 6] },
//             },
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [-118, 6], right: [-43, 6] },
//             },
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [-118, 6], right: [-43, 6] },
//             },
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [-118, 6], right: [-93, 6] },
//             },
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [-118, 6], right: [-90, 6] },
//             },
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [-125, 6], right: [-85, 6] },
//             },
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [-121, 6], right: [-90, 6] },
//             },
//             {
//                 size: [261, 137],
//                 hitboxOffset: { left: [0, 0], right: [0, 0] },
//             },
//         ],
//         sidecut: [
//             {
//                 size: [239, 141],
//                 hitboxOffset: { left: [-127, 8], right: [-62, 8] },
//             },
//         ],
//         slash: [
//             {
//                 size: [181, 183],
//                 hitboxOffset: { left: [-90, 8], right: [-37, 8] },
//             },
//         ],
//         upswing: [
//             {
//                 size: [205, 167],
//                 hitboxOffset: { left: [-102, 8], right: [-52, 8] },
//             },
//         ],
//         walk_backward: [
//             {
//                 size: [105, 142],
//                 hitboxOffset: { left: [-21, 11], right: [-31, 11] },
//             },
//         ],
//         walk_forward: [
//             {
//                 size: [105, 142],
//                 hitboxOffset: { left: [-21, 11], right: [-31, 11] },
//             },
//         ],
//     },
// };

export const spriteDataPhaser: Record<string, Record<string, SpriteData[]>> = {
    antoc: {
        block: [
            {
                size: [343, 239],
                hitboxOffset: { left: [20, -102], right: [80, -100] },
            },
        ],
        dash_backward: [
            {
                size: [193, 142],
                hitboxOffset: { left: [90, -50], right: [11, -50] },
            },
        ],
        dash_forward: [
            {
                size: [193, 142],
                hitboxOffset: { left: [115, -50], right: [26, -50] },
            },
            {
                size: [193, 142],
                hitboxOffset: { left: [115, -50], right: [45, -50] },
            },
            {
                size: [193, 142],
                hitboxOffset: { left: [115, -50], right: [45, -50] },
            },
            {
                size: [193, 142],
                hitboxOffset: { left: [100, -50], right: [35, -50] },
            },
        ],
        hori: [
            {
                size: [343, 239],
                hitboxOffset: { left: [10, -102], right: [90, -102] },
            },
        ],
        idle: [
            {
                size: [180, 142],
                hitboxOffset: { left: [92, -54], right: [8, -54] },
            },
        ],
        knocked: [
            {
                size: [363, 217],
                hitboxOffset: { left: [170, -82], right: [-55, -82] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [190, -50], right: [30, -50] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [170, -40], right: [50, -35] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [130, -40], right: [90, -40] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [100, -60], right: [110, -60] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [80, -90], right: [135, -90] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [40, -90], right: [185, -90] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [40, -90], right: [200, -90] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [10, -90], right: [120, -90] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [30, -90], right: [70, -90] },
            },
            {
                size: [363, 217],
                hitboxOffset: { left: [40, -90], right: [65, -90] },
            },
        ],
        vert: [
            {
                size: [343, 239],
                hitboxOffset: { left: [10, -103], right: [90, -103] },
            },
        ],
        walk_backward: [
            {
                size: [185, 142],
                hitboxOffset: { left: [80, -52], right: [20, -52] },
            },
        ],
        walk_forward: [
            {
                size: [185, 142],
                hitboxOffset: { left: [80, -52], right: [20, -52] },
            },
        ],
        hurt: [
            {
                size: [343, 239],
                hitboxOffset: { left: [11, -100], right: [91, -100] },
            },
        ],
        clash: [
            {
                size: [213, 167],
                hitboxOffset: { left: [69, -85], right: [31, -85] },
            },
        ],
        jump: [
            {
                size: [343, 239],
                hitboxOffset: { left: [13, -102], right: [87, -102] },
            },
        ],
        step_forward: [
            {
                size: [343, 239],
                hitboxOffset: { left: [31, -102], right: [112, -102] },
            },
        ],
        low_kick: [
            {
                size: [291, 200],
                hitboxOffset: { left: [63, -83], right: [37, -83] },
            },
        ],
        drop_slash: [
            {
                size: [343, 244],
                hitboxOffset: { left: [63, -83], right: [87, -100] },
            },
        ],
        cyclone: [
            {
                size: [323, 217],
                hitboxOffset: { left: [50, -81], right: [50, -81] },
            },
        ],
        taunt: [
            {
                size: [343, 239],
                hitboxOffset: { left: [10, -101], right: [90, -101] },
            },
        ],
    },
    jessica: {
        block: [
            {
                size: [103, 126],
                hitboxOffset: { left: [47, -53], right: [49, -53] },
            },
        ],
        clash: [
            {
                size: [132, 141],
                hitboxOffset: { left: [59, -67], right: [41, -67] },
            },
        ],
        dash_backward: [
            {
                size: [147, 106],
                hitboxOffset: { left: [25, -45], right: [80, -50] },
            },
        ],
        dash_forward: [
            {
                size: [113, 104],
                hitboxOffset: { left: [50, -50], right: [60, -50] },
            },
            {
                size: [113, 104],
                hitboxOffset: { left: [72, -50], right: [68, -50] },
            },
            {
                size: [113, 104],
                hitboxOffset: { left: [95, -50], right: [75, -50] },
            },
            {
                size: [113, 104],
                hitboxOffset: { left: [95, -50], right: [75, -50] },
            },
        ],
        hurt: [
            {
                size: [105, 142],
                hitboxOffset: { left: [55, -60], right: [45, -60] },
            },
        ],
        idle: [
            {
                size: [96, 126],
                hitboxOffset: { left: [50, -53], right: [45, -53] },
            },
        ],
        knocked: [
            {
                size: [261, 137],
                hitboxOffset: { left: [120, -55], right: [10, -55] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [75, -55], right: [50, -55] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [100, -20], right: [80, -20] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [90, -10], right: [85, -10] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [80, -10], right: [78, -10] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [80, -9], right: [80, -10] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [80, -9], right: [85, -9] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [40, -10], right: [40, -10] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [55, -20], right: [45, -20] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [45, -30], right: [45, -30] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [45, -47], right: [45, -47] },
            },
            {
                size: [261, 137],
                hitboxOffset: { left: [0, 0], right: [0, 0] },
            },
        ],
        sidecut: [
            {
                size: [239, 141],
                hitboxOffset: { left: [20, -60], right: [80, -60] },
            },
        ],
        slash: [
            {
                size: [181, 183],
                hitboxOffset: { left: [25, -80], right: [75, -80] },
            },
        ],
        upswing: [
            {
                size: [205, 167],
                hitboxOffset: { left: [28, -78], right: [72, -78] },
            },
        ],
        walk_backward: [
            {
                size: [105, 142],
                hitboxOffset: { left: [56, -58], right: [40, -58] },
            },
        ],
        walk_forward: [
            {
                size: [105, 142],
                hitboxOffset: { left: [56, -58], right: [40, -58] },
            },
        ],
        jump: [
            {
                size: [135, 146],
                hitboxOffset: { left: [33, -63], right: [67, -63] },
            },
        ],
        gatotsu: [
            {
                size: [205, 167],
                hitboxOffset: { left: [28, -75], right: [76, -75] },
            },
            {
                size: [205, 167],
                hitboxOffset: { left: [28, -75], right: [76, -75] },
            },
            {
                size: [205, 167],
                hitboxOffset: { left: [28, -75], right: [76, -75] },
            },
            {
                size: [205, 167],
                hitboxOffset: { left: [28, -75], right: [60, -75] },
            },
            {
                size: [205, 167],
                hitboxOffset: { left: [28, -75], right: [60, -75] },
            },
            {
                size: [205, 167],
                hitboxOffset: { left: [28, -75], right: [60, -75] },
            },
            {
                size: [205, 167],
                hitboxOffset: { left: [28, -75], right: [76, -75] },
            },
        ],
        low_kick: [
            {
                size: [135, 146],
                hitboxOffset: { left: [33, -63], right: [67, -63] },
            },
        ],
        birdswing: [
            {
                size: [259, 218],
                hitboxOffset: { left: [10, -63], right: [87, -63] },
            },
        ],
        taunt: [
            {
                size: [261, 137],
                hitboxOffset: { left: [23, -63], right: [72, -63] },
            },
        ],
    },
};
