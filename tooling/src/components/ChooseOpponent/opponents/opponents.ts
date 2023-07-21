import { Adam } from './Adam';
import { AntocAttack } from './Antoc-Attack';
import { Eve } from './Eve';
import { JessicaAttack } from './Jessica-Attack';
import { Kat } from './Kat';
import { SimpleJoe } from './SimpleJoe';
import { opponent0Antoc, opponent0Jessica } from './opponent-0';

export const JessicaOpponents = [
    opponent0Antoc,
    AntocAttack,
    JessicaAttack,
    SimpleJoe,
    Kat,
    Adam,
    Eve,
];
export const AntocOpponents = [
    opponent0Jessica,
    JessicaAttack,
    AntocAttack,
    Kat,
    SimpleJoe,
    Eve,
    Adam,
];
