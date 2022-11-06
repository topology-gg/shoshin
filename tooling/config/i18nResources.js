const resources = {
    en: {
        translation: {
            MuMu: "MuMu - season 0 prelaunch",
            Subtitle: "An experiment by Topology",
            "Connect": "Connect ",
            "Connected": "You are: ",
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
            "Stir ": "Stir ",
            "Shake": "Shake",
            "Steam": "Steam",
            "Smash": "Smash",
            "Submit to": "Submit to",
            "demo-blank": "Blank",
            "demo": "Demo",
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
                    'Faucet is marked as "F" on the board, while Sink is marked as "S" on the board.',
                instructionsLine8:
                    "Program size shall not exceed 40 instructions.",
                formulaList: "Formula list",
                goal: "Goal",
                goalAffordance:
                    "With Faucet replenishing <1 /> at one unit per frame,",
                goalDeliver: "Produce and deliver <1 /> to Sink.",
                goalLine2: "Minimize the latency and cost of your solution.",
                costTitle: "Cost",
                staticCostTitle: "Static Cost",
                staticCostLine1: "Mech: 150 / piece",
                staticCostLine2: "Stir: 250 / formula",
                staticCostLine3: "Shake: 500 / formula",
                staticCostLine4: "Steam: 750 / formula",
                staticCostLine5: "Smash: 1000 / formula",
                dynamicCostTitle: "Dynamic Cost",
                dynamicCostLine1: "Mech movement (W,A,S,D) when carrying atom: 10 / frame",
                dynamicCostLine2: "Mech movement (W,A,S,D) when not carrying atom: 20 / frame",
                dynamicCostLine3: "Mech pickup atom (Z / G): 25 / frame",
                dynamicCostLine4: "Mech drop atom (X / H): 25 / frame",
                dynamicCostLine5: "Mech blocked (G / H): 3 / frame",
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
            leaderboard: {
                title: "Top 20 Solutions",
                rank: "Rank",
                account: "Who",
                delivered: "Delivered",
                static_cost: "Static cost",
                latency: "Average latency per delivery",
                dynamic_cost: "Average dynamic cost per delivery",
                block_number: "Block number"
            }
        },
    },
    cn: {
        translation: {
            MuMu: "挪挪 - 第0季發佈準備",
            Subtitle: "Topology 的一項實驗",
            "Connect": "連接 ",
            "Connected": "你是: ",
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
            "Stir ": "攪攪",
            "Shake": "搖搖",
            "Steam": "蒸蒸",
            "Smash": "砸砸",
            "Submit to": "提交至",
            "demo-blank": "空白",
            "demo": "範例",
            tutorial: {
                title: "怎麼玩",
                thesisTheme: "主題",
                thesisLine1:
                    "在第1層區塊鏈上，人們透過貢獻資本來鑄造身份。第2層區塊鏈具備擴展的運算容量，人們可以通過驗證技能來鑄造身份。",
                thesisLine2:
                    "<挪挪>是一種結合組合語言和並行處理的多維度優化謎題。在板上擺放小機械們，透過編程描述他們的行為，然後擺放配方，將水龍頭 (Faucet) 產出的原料風味原子轉換成目標風味原子，投遞於水槽 (Sink)。玩家提交的解決方案將以吞吐量和成本進行排名。",
                instructions: "玩法",
                instructionsLine1:
                    "目前只有單例機械 (Singleton) 可用，其指令集：[<1>W</1>,<3>A</3>,<5>S</5>,<5>D</5>] 為移動 (每幀移動一格)、<7>Z</7> 為撿起原子、<9>X</9> 為放下原子、<11>G</11> 為阻塞程序直到能夠撿起原子，還有 <13>H</13> 為阻塞程序直到能夠放下原子。",
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
                    '水龍頭在板上以 "F" 標示；水槽則以 "S" 標示。',
                instructionsLine8:
                    "任一機械的程序長度上限為 40 個指令。",
                formulaList: "配方列表",
                goal: "目標",
                goalAffordance: "利用水龍頭以每幀添補一單位 <1 /> 的特性，",
                goalDeliver: "製造 <1 /> 並遞送至水槽。",
                goalLine2: "優化解決方案的延遲和成本。",
                costTitle: "成本",
                staticCostTitle: "靜態成本",
                staticCostLine1: "機械 (單例): 150 / 隻",
                staticCostLine2: "攪攪: 250 / 配方",
                staticCostLine3: "搖搖: 500 / 配方",
                staticCostLine4: "蒸蒸: 750 / 配方",
                staticCostLine5: "砸砸: 1000 / 配方",
                dynamicCostTitle: "動態成本",
                dynamicCostLine1: "機械無攜帶原子時移動 (W,A,S,D): 10 / 幀",
                dynamicCostLine2: "機械有攜帶原子時移動 (W,A,S,D): 20 / 幀",
                dynamicCostLine3: "機械撿起原子 (Z / G): 25 / 幀",
                dynamicCostLine4: "機械放下原子 (X / H): 25 / 幀",
                dynamicCostLine5: "機械程序阻塞 (G / H): 3 / 幀",
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
            leaderboard: {
                title: "天下前 20 最優解",
                rank: "排行",
                account: "誰",
                delivered: "總遞送",
                static_cost: "靜態成本",
                latency: "平均遞送延遲",
                dynamic_cost: "平均遞送動態成本",
                block_number: "區塊高度"
            }
        },
    },
    fr: {
        translation: {
            MuMu: "BouBou",
            Subtitle: "Une experience realisée par Topology",
            frame: "Séquence",
            mech: "mech",
            newMech: "nouveau mech",
            removeMech: "supprimer mech",
            newOperation: "nouvelle {{operation}}",
            removeOp: "supprimer op",
            run: "Run",
            pause: "Pause",
            stop: "Stop",
            incrementFrame: "+1 séquence",
            decrementFrame: "-1 séquence",
            "Stir ": "Remuer   ",
            Shake: "Secouer  ",
            Steam: "Vaporiser",
            Smash: "Fracasser",
            tutorial: {
                title: "Comment jouer",
                thesisTheme: "Thèse et Thème",
                thesisLine1:
                    "Les blockchains layer 1 distribuent une identité par contribution financière ou pay to mint. Les blockchains layer 2, avec leur capacité de calcul supérieure, permettraient de revendiquer une identité à travers la vérification de compétence ou solve to mint.",
                thesisLine2:
                    "BouBou est un puzzle qui combine la programmation visuelle et parallèle. Il s'agit de programmer et placer des petits robots (\"mechs\") sur le damier et de placer les opérateurs qui exécutent des formules pour transporter et transmuter différents types d'atomes depuis le Faucet jusqu'à l'évier",
                instructions: "Instructions",
                instructionsLine1:
                    "Actuellement, il n’existe que les mécanismes (\"mech\") singletons, dont l'ensemble des instructions est [<1>W</1>,<3>A</3>,<5>S</5>,<5>D</5>] pour le déplacement, <7>Z</7> pour ramasser, <9>X</9> pour déposer, <11>G</11> pour attendre jusqu'à ce qu'un ramassage soit possible et <13>H</13> pour attendre jusqu'à ce qu'un dépôt soit possible,",
                instructionsLine2:
                    "Détails sur <1>G</1>: le mech restera bloqué sur cette instruction jusqu'à ce qu'un atome libre soit disponible à sa localisation sur le damier. Le mech ramasse alors l'atome dans la séquence actuelle et continuera l'exécution normale de ses instructions dans la séquence suivante. Si le mech est fermé quand il arrive à cette instruction (i.e. incapable de ramasser), l'instruction est passée.",
                instructionsLine3:
                    "Détails sur <1>G</1>: le mech restera bloqué sur cette instruction jusqu'à ce que sa localisation sur le damier soit libre. Le mech dépose alors l'atome dans la séquence actuelle et continuera l'exécution normale de ses instructions dans la séquence suivante. Si le mech est ouvert quand il arrive à cette instruction (i.e. incapable de déposer), l'instruction est passée.",
                instructionsLine4: "le symbole _ répresente une non-opération",
                instructionsLine5:
                    "Pendant la simulation, chaque mech parcourt son programme (séquence d'instructions) en boucle.",
                instructionsLine6:
                    "Détails sur le placement des opérateurs: les opérandes et produits doivent être continues i.e. pour a+b=c, a&b et b&c doivent être voisins. Quand la règle de continuité est violée, les opérateurs ne sont pas affichés.",
                instructionsLine7:
                    'Le Faucet et le Sink sont représentés respectivement par un "F" et un "S" sur le damier.',
                instructionsLine8:
                    "Le Faucet peut produire <1 /> au rythme d'une unité par séquence.",
                formulaList: "Liste des Formules",
                goal: "Objectif",
                goalAffordance:
                    "En utilisant le Faucet qui produit <1 /> au rythme d'une unité par séquence,",
                goalDeliver: "Produit et livre <1 /> au Sink.",
                goalLine2: "Minimise la latence et le coût de la solution.",
            },
            delivery: {
                accumulatedCost: "Coût accumulé",
                delivered: "Livré",
            },
            summary: {
                title: "Résumé de la dernière simulation",
                totalPre: "Nombre total de livraisons en",
                totalPost: " unité(s)",
                inFrames: "en {{frames}} séquences",
                averageLatencyPre: "Latence moyenne par",
                averageLatencyPost: "unité livrée",
                averageDynamicCostPre: "Coût dynamique moyen par",
                averageDynamicCostPost: "unité livrée",
                delivery: "Livré",
                staticCost: "Coût statique",
            },
        },
    },
};

export default resources;
