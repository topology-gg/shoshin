import i18n from "i18next";

import { initReactI18next } from "react-i18next";

// const resources = {
//     en: {
//         translation: {
//             Frame: "Frame",
//             "new operation": "new {{operation}}",
//             "remove op": "remove op",
//             tutorial: {
//                 "thesis-theme": "Theme",
//                 thesisLine1:
//                     "Layer 1 blockchains assert identity by capital contribution - pay to mint. Layer 2 blockchains, with new affordance in compute capacity, would assert identity by skill verification - solve to mint.",
//                 thesisLine2:
//                     'MovyMovy is a puzzle about parallel assembly programming and multi-dimensional optimisation. Place & program the little robots ("mechs"), and place the operators that execute formulas, to transmute & transport flavorful atoms from Faucet to Sink. Solutions are ranked by throughput and cost.',
//                 instructions: "Instructions"
//             },
//         },
//     },
//     cn: {
//         translation: {
//             "How to play": "怎麼玩",
//             Frame: "幀",
//             "MovyMovy": "挪挪",
//             "new mech": "添加機器",
//             "remove mech": "移除機器",
//             "new op &": "添加配方 &",
//             "new op %": "添加配方 %",
//             "new op ~": "添加配方 ~",
//             "new op #": "添加配方 #",
//             "remove op": "移除配方",
//             "Run": "啟動",
//             "Pause": "暫停",
//             "Stop": "停止",
//             "mech": "機器",
//             "Stir ": "攪攪",
//             "Shake": "搖搖",
//             "Steam": "蒸蒸",
//             tutorial: {
//                 "thesis-theme": "主題",
//                 thesisLine1:
//                     "在第1層區塊鏈上，人們透過貢獻資本來鑄造身份。第2層區塊鏈具備擴展的運算容量，人們可以通過驗證技能來鑄造身份。",
//                 thesisLine2:
//                     "<挪挪>是一種結合組合語言和並行處理的多維度優化謎題。擺放和編程小機器們，然後擺放配方，將水龍頭 (Faucet) 產出的原料風味原子轉換成目標風味原子，投遞於水槽 (Sink)。玩家提交的解決方案將通過吞吐量和成本進行排名。",
//                 instructions: "玩法",


//             },
//         },
//     },
// };
import resources from "./i18nResources";

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources,
        lng: "en", // if you're using a language detector, do not define the lng option
        fallbackLng: "en",

        interpolation: {
            escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        },
    });

export default i18n;
