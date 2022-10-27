import i18n from "i18next";

import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            Frame: "Frame",
            "new operation": "new {{operation}}",
            "remove op": "remove op",
            tutorial: {
                thesisLine1:
                    "Layer 1 blockchains assert identity by capital contribution - pay to mint. Layer 2 blockchains, with new affordance in compute capacity, would assert identity by skill verification - solve to mint.",
                thesisLine2:
                    'MovyMovy is a puzzle about visual & parallel assembly programming. Place & program the little robots ("mechs"), and place the operators that execute formulas, to transport & transmute flavorful atoms from Faucet to Sink. Solutions are ranked by throughput and cost.',
            },
        },
    },
    cn: {
        translation: {
            Frame: "框架",
            "new mech": "新苔蘚",
            tutorial: {
                thesisLine1:
                    "第1層區塊鏈通過資本貢獻主張身份 - 向薄荷付款。第2層區塊鏈具有新的負擔能力，可以通過技能驗證來確定身份 - 解決薄荷。",
                thesisLine2:
                    "MovyMovy是關於視覺和並行組裝編程的難題。放置和編程小機器人（“機械”），並將執行公式的操作員放置，以從水龍頭運輸和傳輸可口的原子到下沉。解決方案通過吞吐量和成本進行排名。",
            },
        },
    },
};

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
