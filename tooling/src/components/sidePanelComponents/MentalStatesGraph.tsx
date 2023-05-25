import React, { useEffect, useRef } from "react";
import vis, { Data, Edge, Network, Options } from "vis-network";

function generateGraphData(
    mentalStateNamesOrdered: string[],
    nextMentalStateNamesOrdered: string[][]
) {
    const nodes = mentalStateNamesOrdered.map((name, i) => ({
        id: i,
        label: name,
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
}: {
    mentalStateNamesOrdered: string[];
    nextMentalStateNamesOrdered: string[][];
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
        console.log('graph data:', data)
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
        };
        graphRef.current = new vis.Network(container, data, options);
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
