import { Character } from '../../constants/constants';
import { layersToAgentComponents } from '../../types/Layer';
import TreeEditor from './TreeEditor';

export const GambitTree = ({
    index,
    layers,
    character,
    handleClickTreeEditor,
    combos,
}) => {
    let char = Object.keys(Character).indexOf(character);

    //given layers
    const {
        mentalStates: generatedMs,
        conditions: generatedConditions,
        trees: generatedTrees,
    } = layersToAgentComponents(layers, char, combos);

    /*     console.log('generatedMs', generatedMs);
    console.log('generatedConditions', generatedConditions);
    console.log('generatedTrees', generatedTrees); */

    return (
        <TreeEditor
            isReadOnly={true}
            indexTree={index}
            tree={generatedTrees[index]}
            handleUpdateTree={undefined}
            mentalStates={generatedMs}
            conditions={generatedConditions}
            handleClickTreeEditor={handleClickTreeEditor}
            isWarningTextOn={undefined}
            warningText={undefined}
            newThoughtClicks={undefined}
        />
    );
};
