import Grid from "../types/Grid";

export function isIdenticalGrid ( // somehow this is not exportable from simulator.tsx, so making a duplicate here
    grid1: Grid,
    grid2: Grid
): boolean {
    return JSON.stringify(grid1) == JSON.stringify(grid2)
}

export function isGridOOB (grid: Grid, bound: number): boolean {
    if (grid.x < 0 || grid.x > bound-1 || grid.y < 0 || grid.y > bound-1) return true;
    return false;
}

export function areGridsNeighbors (
    grid1: Grid,
    grid2: Grid
): boolean {
    if (
        (grid1.x == grid2.x && Math.abs(grid1.y - grid2.y)==1) ||
        (grid1.y == grid2.y && Math.abs(grid1.x - grid2.x)==1)
    ) return true;
    return false;
}