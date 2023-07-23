import { Adam } from './Adam';
import { AntocAttack } from './Antoc-Attack';
import { Eve } from './Eve';
import { HealthyDose } from './HealthyDose';
import { JessicaAttack } from './Jessica-Attack';
import { Kat } from './Kat';
import { Shinigami } from './Shinigami';
import { SimpleJoe } from './SimpleJoe';
import { Tempete } from './Tempete';
import { opponent0Antoc, opponent0Jessica } from './opponent-0';

export const JessicaOpponents = [
    { agent: opponent0Antoc, mindName: 'Idle', backgroundId: 1 },
    { agent: AntocAttack, mindName: 'Antoc Attack!', backgroundId: 2 },
    { agent: JessicaAttack, mindName: 'Jessica Attack!', backgroundId: 2 },
    { agent: SimpleJoe, mindName: 'Simple Joe', backgroundId: 3 },
    { agent: Shinigami, mindName: 'Shinigami', backgroundId: 5 },
    { agent: Kat, mindName: 'Kat', backgroundId: 1 },
    { agent: Adam, mindName: 'Adam', backgroundId: 2 },
    { agent: Eve, mindName: 'Eve', backgroundId: 3 },
    { agent: HealthyDose, mindName: 'Healthy Dose', backgroundId: 4 },
    { agent: Tempete, mindName: 'Tempete', backgroundId: 5 },
];
export const AntocOpponents = [
    { agent: opponent0Jessica, mindName: 'Idle', backgroundId: 1 },
    { agent: JessicaAttack, mindName: 'Jessica Attack!', backgroundId: 2 },
    { agent: AntocAttack, mindName: 'Antoc Attack!', backgroundId: 2 },
    { agent: Kat, mindName: 'Kat', backgroundId: 1 },
    { agent: SimpleJoe, mindName: 'Simple Joe', backgroundId: 3 },
    { agent: Shinigami, mindName: 'Shinigami', backgroundId: 5 },
    { agent: Eve, mindName: 'Eve', backgroundId: 3 },
    { agent: Adam, mindName: 'Adam', backgroundId: 2 },
    { agent: HealthyDose, mindName: 'Healthy Dose', backgroundId: 4 },
    { agent: Tempete, mindName: 'Tempete', backgroundId: 5 },
];
