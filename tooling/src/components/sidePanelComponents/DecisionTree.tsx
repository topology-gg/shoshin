import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use( dagre );

interface DecisionTreeProps {
    data: any,
    height: number,
    width: number,
}

const DecisionTree = ({ data, height, width }) => {

    let cyStyle = {
        height: height,
        width: width,
        margin: '20px 0px',
    }

    useEffect(() => {
        console.log('* Cytoscape.js is rendering the graph..');

        let cy = cytoscape({
            container: document.getElementById('cy'),

            boxSelectionEnabled: false,
            autounselectify: true,

            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'height': 80,
                    'width': 80,
                    'background-fit': 'cover',
                    'border-color': '#36454F',
                    'background-color': '#FFFFFF',
                    'border-width': 1,
                    'border-opacity': 0.5,
                    'content': 'data(id)',
                    'text-valign': 'center',
                    'color': '#36454F',
                })
                .selector('edge')
                .css({
                    'width': 3,
                    'target-arrow-shape': 'triangle',
                    'line-color': '#36454F',
                    'target-arrow-color': '#36454F',
                    'curve-style': 'bezier',
                })
            ,
            elements: {
                nodes: data.nodes,
                edges: data.edges,
            },
            layout: {
                name: 'dagre',
                directed: true,
                padding: 1,
            },
        });

        let nodes = []
        cy.edges().map((e) => {
            let id = e.source().id()
            if (! nodes.includes(id)) {
                nodes.push(id)
            }
            return 0
        })

        cy.nodes().filter((e) => {
            return !nodes.includes(e.id()) && e.scratch().branch === 'left'
        })
        .style({
            "background-color": "#fedfb0"
        })

        cy.nodes().filter((e) => {
            return !nodes.includes(e.id()) && e.scratch().branch === 'right'
        })
        .style({
            "background-color": "#fedfb0"
        })


        // cy.nodes().map((n) => {
        //     let size = Math.floor(n.id().length - 4) * 6 + 70
        //     n.style({height: size, width: size})
        //     return n
        // })

        cy.zoom(1.0)
        cy.minZoom(0.5)
        cy.maxZoom(1.1)
    })

    return (
        <div>
            <div style={cyStyle} id="cy" />
        </div>
    );
}

export default DecisionTree;