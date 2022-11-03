const resources = {
    en: {
        translation: {
            MuMu: "MuMu",
            Subtitle: "An experiment by Topology",
            frame: "Frame",
            mech: "mech",
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
            "Stir ": "Stir ",
            "Shake": "Shake",
            "Steam": "Steam",
            "Smash": "Smash",
            tutorial: {
                title: "How to play",
                thesisTheme: "Thesis & Theme",
                thesisLine1:
                    "Layer 1 blockchains assert identity by capital contribution - pay to mint. Layer 2 blockchains, with new affordance in compute capacity, would assert identity by skill verification - solve to mint.",
                thesisLine2:
                    'MovyMovy is a puzzle about visual & parallel assembly programming. Place & program the little robots ("mechs") on the board, and place the operators that execute formulas, to transport & transmute flavorful atoms from Faucet to Sink. Solutions are ranked by throughput and cost.',
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
                instructionsLine7:
                    "Faucet is marked as \"F\" on the board, while Sink is marked as \"S\" on the board.",
                instructionsLine8:
                    "Program size shall not exceed 40 instructions.",
                formulaList: "Formula list",
                goal: "Goal",
                goalAffordance: "With Faucet replenishing <1 /> at one unit per frame,",
                goalDeliver: "Produce and deliver <1 /> to Sink.",
                goalLine2: "Minimize the latency and cost of your solution.",
            },
            delivery: {
                accumulatedCost: "Accumulated cost",
                delivered: "Delivered",
            },
            summary: {
                title: "Summary of last run",
                totalPre: "Total deliveries of",
                totalPost: " unit(s)",
                inFrames: "in {{frames}} frames",
                averageLatencyPre: "Average latency per",
                averageLatencyPost: "unit delivery",
                averageDynamicCostPre: "Average dynamic cost per",
                averageDynamicCostPost: "unit delivery",
                delivery: "delivery",
                staticCost: "Static cost",
            },
        },
    },
    cn: {
        translation: {
            MuMu: "挪挪",
            Subtitle: "Topology 的一項實驗",
            frame: "幀",
            mech: "機械",
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
            "Stir ": "攪攪",
            "Shake": "搖搖",
            "Steam": "蒸蒸",
            "Smash": "砸砸",
            tutorial: {
                title: "怎麼玩",
                thesisTheme: "主題",
                thesisLine1:
                    "在第1層區塊鏈上，人們透過貢獻資本來鑄造身份。第2層區塊鏈具備擴展的運算容量，人們可以通過驗證技能來鑄造身份。",
                thesisLine2:
                    "<挪挪>是一種結合組合語言和並行處理的多維度優化謎題。在板上擺放小機械們，透過編程描述他們的行為，然後擺放配方，將水龍頭 (Faucet) 產出的原料風味原子轉換成目標風味原子，投遞於水槽 (Sink)。玩家提交的解決方案將以吞吐量和成本進行排名。",
                instructions: "玩法",
                instructionsLine1:
                    '目前只有單例機械 (Singleton) 可用，其指令集：[<1>W</1>,<3>A</3>,<5>S</5>,<5>D</5>] 為移動 (每幀移動一格)、<7>Z</7> 為撿起原子、<9>X</9> 為放下原子、<11>G</11> 為阻塞程序直到能夠撿起原子，還有 <13>H</13> 為阻塞程序直到能夠放下原子。',
                instructionsLine2:
                    "補充說明 <1>G</1> 指令: 機械程序將阻塞於此指令，直到機械位置的板上有能夠被撿起的原子。當條件滿足，機械將於同幀撿起原子，並取消阻塞。如果執行此指令時機械處於關閉狀態（即不可能再撿起更多原子），此指令將形同無操作，不會阻塞。",
                instructionsLine3:
                    "補充說明 <1>H</1> 指令: 機械程序將阻塞於此指令，直到機械位置的板上產生空缺能夠容納原子。當條件滿足，機械將於同幀放下原子，並取消阻塞。如果執行此指令時機械處於開放狀態（即無原子可放），此指令將形同無操作，不會阻塞。",
                instructionsLine4: "_ 指令為無操作 (no operation)。",
                instructionsLine5:
                    "在運行過程中，每個機械將循環執行其自身程序（指令序列）。",
                instructionsLine6:
                    "配方擺法的連續性規則：輸入和輸出必須位於連續的網格。以 &(A, B) = C 為例，A 和 B 以及 B 和 C 都必須是鄰居關係。違反連續性規則時，版面上不會渲染配方符號。",
                instructionsLine7:
                    "水龍頭在板上以 \"F\" 標示；水槽則以 \"S\" 標示。",
                instructionsLine8:
                    "任一機械的程序長度上限為 40 個指令。",
                formulaList: "配方列表",
                goal: "目標",
                goalAffordance: "利用水龍頭以每幀添補一單位 <1 /> 的特性，",
                goalDeliver: "製造 <1 /> 並遞送至水槽。",
                goalLine2: "優化解決方案的延遲和成本。",
            },
            delivery: {
                accumulatedCost: "累計成本",
                delivered: "遞送",
            },
            summary: {
                title: "效能摘要",
                totalPre: "{{frames}} 幀內總遞送",
                totalPost: "單位",
                inFrames: "",
                averageLatencyPre: "每單位",
                averageLatencyPost: "遞送平均延遲",
                averageDynamicCostPre: "每單位",
                averageDynamicCostPost: "遞送平均動態成本",
                delivery: "送貨",
                staticCost: "靜態成本",
            },
        },
    },
};

export default resources;
