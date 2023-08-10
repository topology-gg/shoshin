import { Action } from '../../../types/Action';
import Agent, { buildAgent } from '../../../types/Agent';
import { Layer, layersToAgentComponents } from '../../../types/Layer';

export const buildAgentFromLayers = (
    layers: Layer[],
    char: number,
    combos: Action[][]
): Agent => {
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
