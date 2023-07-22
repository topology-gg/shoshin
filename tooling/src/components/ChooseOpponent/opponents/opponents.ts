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
    { agent: opponent0Antoc, mindName: 'Idle' },
    { agent: AntocAttack, mindName: 'Antoc Attack!' },
    { agent: JessicaAttack, mindName: 'Jessica Attack!' },
    { agent: SimpleJoe, mindName: 'Simple Joe' },
    { agent: Shinigami, mindName: 'Shinigami' },
    { agent: Kat, mindName: 'Kat' },
    { agent: Adam, mindName: 'Adam' },
    { agent: Eve, mindName: 'Eve' },
    { agent: HealthyDose, mindName: 'Healthy Dose' },
    { agent: Tempete, mindName: 'Tempete' },
];
export const AntocOpponents = [
    { agent: opponent0Jessica, mindName: 'Idle' },
    { agent: JessicaAttack, mindName: 'Jessica Attack!' },
    { agent: AntocAttack, mindName: 'Antoc Attack!' },
    { agent: Kat, mindName: 'Kat' },
    { agent: SimpleJoe, mindName: 'Simple Joe' },
    { agent: Shinigami, mindName: 'Shinigami' },
    { agent: Eve, mindName: 'Eve' },
    { agent: Adam, mindName: 'Adam' },
    { agent: HealthyDose, mindName: 'Healthy Dose' },
    { agent: Tempete, mindName: 'Tempete' },
];
