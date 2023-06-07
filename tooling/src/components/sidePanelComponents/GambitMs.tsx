import { useContext } from 'react';
import MentalStates from './MentalStates';
import { createContext } from 'vm';
import { CharacterContext, LayerContext } from '../../../pages';
import { layersToAgentComponents } from '../../types/Layer';
import { Character } from '../../constants/constants';

//Read only Mental State window to show layers instantiated as state machine
export const GambitMs = ({ layers, character, handleClickTreeEditor }) => {
    let char = Object.keys(Character).indexOf(character);

    console.log('layers', layers);
    //given layers
    const {
        mentalStates: generatedMs,
        conditions: generatedConditions,
        trees: generatedTrees,
    } = layersToAgentComponents(layers, char);

    /*     console.log('generatedMs', generatedMs);
    console.log('generatedConditions', generatedConditions);
    console.log('generatedTrees', generatedTrees); */
    return (
        <MentalStates
            isReadOnly={true}
            mentalStates={generatedMs}
            trees={generatedTrees}
            initialMentalState={0}
            combos={[]}
            character={character}
            handleSetInitialMentalState={undefined}
            handleAddMentalState={undefined}
            handleClickRemoveMentalState={undefined}
            handleSetMentalStateAction={undefined}
            handleClickTreeEditor={handleClickTreeEditor}
        />
    );
};
