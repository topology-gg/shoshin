import React, { useEffect, useRef } from "react";
import vis, { Data, Edge, Network, Options } from "vis-network";
function generateGraphData(
    mentalStateNamesOrdered: string[],
    nextMentalStateNamesOrdered: string[][]
) {
    const nodes = mentalStateNamesOrdered.map((name, i) => ({
        id: i,
        label: name,
        // x : 0, y : 0 makes the node positions consistant between renders
        x: 0,
        y: 0
    }));
    let mapLabelToIndex = {}
    mentalStateNamesOrdered.forEach((value: string, index: number) => {
        mapLabelToIndex[value] = index
    })

    // create an array with edges
    const edges: Edge[] = mentalStateNamesOrdered.flatMap( (fromName, fromNodeIndex) =>

        nextMentalStateNamesOrdered[fromNodeIndex].reduce(function(result, toName) {
            const toNodeIndex = mapLabelToIndex[toName]
            if (toNodeIndex !== undefined) {
                result.push({
                    from: fromNodeIndex,
                    to: toNodeIndex
                })
            }
            return result;
        }, [])

    );
    return {
        nodes,
        edges,
    };
}

const MentalStatesGraph = ({
    mentalStateNamesOrdered,
    nextMentalStateNamesOrdered,
    highlightMentalState,
    selectMentalState
}: {
    mentalStateNamesOrdered: string[];
    nextMentalStateNamesOrdered: string[][];
    highlightMentalState : (index : number) => void;
    selectMentalState : (index : number) => void;
}) => {

    const containerRef = useRef<HTMLDivElement>();
    const graphRef = useRef<Network>();

    useEffect(() => {
        // create a network
        var container = containerRef.current;
        var data: Data = generateGraphData(
            mentalStateNamesOrdered,
            nextMentalStateNamesOrdered
        );
        var options: Options = {
            autoResize: true,
            height: "400px",
            nodes: {
                label: "A",
                color: "#ffa0bf",
                shape: "box",
                shapeProperties: { borderRadius: 5 },
            },
            edges: {
                arrows: { to: {enabled: true, scaleFactor: 0.5}, },
                arrowStrikethrough: false,
                smooth: false,
                chosen: true,
                color: '#777777'
            },
            interaction: {
                hover: true,
                dragNodes: false, // Disable node dragging
                dragView: false // Disable view dragging
            },
            layout: {
                improvedLayout: false, // Disable dynamic initial layout
                hierarchical: {
                  enabled: false, // Disable hierarchical layout
                  direction: 'UD', // Specify the layout direction (e.g., 'UD' for up-down)
                  sortMethod: 'directed' // Use the directed layout algorithm
                }
              },
              physics : {
                enabled: true, // Enable physics simulation
              }
        };
        let network =  new vis.Network(container, data, options);

        network.on('click', (event) => {
            const nodeId = event?.nodes[0]
            if (nodeId !== undefined){
                selectMentalState(nodeId)
            }
        })
        network.on('hoverNode', (event) => {
            const nodeId = event.node;
            event.event.preventDefault()
            highlightMentalState(nodeId)

        })
        network.on('blurNode', (event) => {
            event.event.preventDefault()
            highlightMentalState(-1)
        })

        graphRef.current = network
    }, []);

    useEffect(() => {
        graphRef.current?.setData(
            generateGraphData(
                mentalStateNamesOrdered,
                nextMentalStateNamesOrdered
            )
        );
        graphRef.current?.redraw(); // Redraw the graph
    }, [mentalStateNamesOrdered, nextMentalStateNamesOrdered]);

    return <div ref={containerRef}></div>;
};

export default MentalStatesGraph;
