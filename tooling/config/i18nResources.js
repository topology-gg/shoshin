const resources = {
    en: {
        translation: {
            frame: "Frame",
            newMech: "new mech",
            removeMech: "remove mech",
            newOperation: "new {{operation}}",
            removeOp: "remove op",
            run: "Run",
            pause: "Pause",
            stop: "Stop",
            incrementFrame: "+1 frame",
            decrementFrame: "-1 frame",
            hovering: "hovering",
            tutorial: {
                title: "How to play",
                thesisTheme: "Thesis & Theme",
                thesisLine1:
                    "Layer 1 blockchains assert identity by capital contribution - pay to mint. Layer 2 blockchains, with new affordance in compute capacity, would assert identity by skill verification - solve to mint.",
                thesisLine2:
                    'MovyMovy is a puzzle about visual & parallel assembly programming. Place & program the little robots ("mechs"), and place the operators that execute formulas, to transport & transmute flavorful atoms from Faucet to Sink. Solutions are ranked by throughput and cost.',
                instructions: "Instructions",
                instructionsLine1:
                    'Only Singleton mechanism ("mech") is available, whose instruction set is [<1>W</1>,<3>A</3>,<5>S</5>,<5>D</5>] for movement, <7>Z</7> for pick-up, <9>X</9> for drop, <11>G</11> for block-until-pick-up, and <13>H</13> for block-until-drop',
                instructionsLine2:
                    "More on <1>G</1>: the mech will wait at this instruction until its location has a free atom to be picked up. It then picks up the free atom in the same frame, and proceed to its next instruction in the next frame. If the mech is closed when encountering this instruction (i.e. not able to pick up), this instruction is treated as no-op.",
                instructionsLine3:
                    "More on <1>H</1>: the mech will wait at this instruction until its location is empty for drop-off. It then drops off the atom in possession in the same frame, and proceed to its next instruction in the next frame. If the mech is open when encountering this instruction (i.e. not possessing an atom for drop-off), this instruction is treated as no-op.",
                instructionsLine4: "_ as instruction means no-operation.",
                instructionsLine5:
                    "During simulation, each mech cycles through its own program (sequence of instructions) on repeat.",
                instructionsLine6:
                    "On operator placement: operands and product must be contiguous grids i.e. for a+b=c, a&b and b&c must both be neighbors. When the contiguity rule is violated, operator symbols are not rendered.",
                formulaList: "Formula list",
                goal: "Goal",
                goalDeliver: "Deliver <1 /> to Sink.",
                goalLine2: "Minimize the latency and cost of your solution.",
            },
            delivery: {
                accumulatedCost: "Accumulated cost",
                delivered: "Delivered",
            },
            summary: {
                title: "Summary of last run",
                total: "Total deliveries of",
                inFrames: "in {{frames}} frames",
                averageLatency: "Average latency per",
                averageDynamicCost: "Average dynamic cost per",
                delivery: "delivery",
                staticCost: "Static cost",
            },
        },
    },
    cn: {
        translation: {
            frame: "框架",
            newMech: "添加機械",
            removeMech: "移除機械",
            newOperation: "添加配方 {{operation}}",
            removeOp: "移除配方",
            run: "啟動",
            pause: "暫停",
            stop: "停止",
            incrementFrame: "+1幀",
            decrementFrame: "-1幀",
            hovering: "鼠標位置",
            tutorial: {
                title: "怎麼玩",
                thesisTheme: "主題",
                thesisLine1:
                    "在第1層區塊鏈上，人們透過貢獻資本來鑄造身份。第2層區塊鏈具備擴展的運算容量，人們可以通過驗證技能來鑄造身份。",
                thesisLine2:
                    "<挪挪>是一種結合組合語言和並行處理的多維度優化謎題。擺放和編程小機器們，然後擺放配方，將水龍頭 (Faucet) 產出的原料風味原子轉換成目標風味原子，投遞於水槽 (Sink)。玩家提交的解決方案將通過吞吐量和成本進行排名。",
                instructions: "玩法",
                instructionsLine1:
                    'Only Singleton mechanism ("mech") is available, whose instruction set is [<1>W</1>,<3>A</3>,<5>S</5>,<5>D</5>] for movement, <7>Z</7> for pick-up, <9>X</9> for drop, <11>G</11> for block-until-pick-up, and <13>H</13> for block-until-drop',
                instructionsLine2:
                    "More on <1>G</1>: the mech will wait at this instruction until its location has a free atom to be picked up. It then picks up the free atom in the same frame, and proceed to its next instruction in the next frame. If the mech is closed when encountering this instruction (i.e. not able to pick up), this instruction is treated as no-op.",
                instructionsLine3:
                    "More on <1>H</1>: the mech will wait at this instruction until its location is empty for drop-off. It then drops off the atom in possession in the same frame, and proceed to its next instruction in the next frame. If the mech is open when encountering this instruction (i.e. not possessing an atom for drop-off), this instruction is treated as no-op.",
                instructionsLine4: "_作為指令意味著無操作。",
                instructionsLine5:
                    "在仿真過程中，每個機甲在重複中循環通過其自己的程序（指令序列）。",
                instructionsLine6:
                    "在操作員放置上：操作數和產品必須是連續的網格，即對於A+B = C，A＆B和B＆C都必須是鄰居。當違反連續性規則時，未呈現操作員符號。",
                formulaList: "公式列表",
                goal: "目標",
                goalDeliver: "遞送 <1 /> to Sink.",
                goalLine2: "最大程度地減少解決方案的延遲和成本。",
            },
            delivery: {
                accumulatedCost: "累積成本",
                delivered: "發表",
            },
            summary: {
                title: "最後運行的摘要",
                total: "總交貨",
                inFrames: "in {{frames}} 幀",
                averageLatency: "平均延遲 per",
                averageDynamicCost: "平均動態成本 per",
                delivery: "送貨",
                staticCost: "靜態成本",
            },
        },
    },
};

export default resources;
