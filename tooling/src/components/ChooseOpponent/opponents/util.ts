import { buildAgent } from '../../../types/Agent';
import { layersToAgentComponents } from '../../../types/Layer';

export const buildAgentFromLayers = (layers, char, combos) => {
    const {
        mentalStates: generatedMs,
        conditions: generatedConditions,
        trees: generatedTrees,
    } = layersToAgentComponents(layers as any, char, combos);

    return buildAgent(
        generatedMs,
        combos,
        generatedTrees,
        generatedConditions,
        0,
        char
    );
};
