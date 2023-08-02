import { useState } from 'react';
import { Character } from '../../../constants/constants';
import { PlayerAgent } from '../../../types/Agent';
import { Layer } from '../../../types/Layer';
import { OnlineOpponent, SavedMind } from '../../../types/Opponent';
import ComboEditor from '../ComboEditor';
import { LayerComponent } from './Gambit';
import { CHARACTERS_ACTIONS } from '../../../types/Action';
import Actions from '../../ComboEditor/Actions';

interface SimpleLayerList {
    playerAgent: PlayerAgent;
}

const SimpleLayerList = ({ playerAgent }: SimpleLayerList) => {
    const { layers, combos, character } = playerAgent;

    const [selectedCombo, changeSelectedCombo] = useState<number>(-1);

    const features = {
        layerAddAndDelete: false,
        conditionAnd: false,
        combos: true,
        sui: false,
    };

    const handleSelectCombo = (layerIndex: number) => {
        const layer = layers[layerIndex];

        if (layer.action.isCombo) {
            changeSelectedCombo(layer.action.id - 101);
        }
    };

    const renderedLayers = layers.map((layer, i) => (
        <LayerComponent
            layer={layer}
            index={i}
            isReadOnly={true}
            character={character}
            conditions={[]}
            actions={[]}
            combos={combos}
            handleChooseAction={() => {}}
            handleChooseCombo={handleSelectCombo}
            handleChooseCondition={() => {}}
            handleInvertCondition={() => {}}
            handleRemoveCondition={() => {}}
            handleRemoveLayer={() => {}}
            isActive={false}
            toggleIsLayerSui={() => {}}
            handleDuplicateLayer={() => {}}
            features={features}
        />
    ));

    const characterIndex = character == Character.Jessica ? 0 : 1;
    const actions = CHARACTERS_ACTIONS[characterIndex];

    return (
        <div id={'mother'}>
            {renderedLayers}
            {selectedCombo >= 0 && combos[selectedCombo] !== undefined && (
                <Actions
                    handleActionDoubleClick={() => {}}
                    isReadOnly={false}
                    combo={combos[selectedCombo]}
                    onChange={() => {}}
                />
            )}
        </div>
    );
};

export default SimpleLayerList;
