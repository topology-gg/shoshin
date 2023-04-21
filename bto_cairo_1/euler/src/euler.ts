import { Node } from './types';

export function buildEulerTour(node: Node, tour: number[] = []) {
    // visit the node
    tour.push(node.value);

    if (node.left) {
        buildEulerTour(node.left, tour);
        // visit the current node after visiting the left subtree
        tour.push(node.value);
    }
    if (node.right) {
        buildEulerTour(node.right, tour);
        // visit the current node after visiting the right subtree
        tour.push(node.value);
    }
}
