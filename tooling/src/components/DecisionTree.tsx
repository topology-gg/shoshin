import React, { useEffect, useState } from 'react';
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
        console.log('data nodes', data.nodes)
        console.log('data edges', data.edges)

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
                    'border-color': '#000',
                    'background-color': '#FFFFFF',
                    'border-width': 1,
                    'border-opacity': 0.5,
                    'content': 'data(id)',
                    'text-valign': 'center',
                })
                .selector('edge')
                .css({
                    'width': 3,
                    'target-arrow-shape': 'triangle',
                    'line-color': 'black',
                    'target-arrow-color': 'black',
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
            "background-color": "green" 
        })

        cy.nodes().filter((e) => {
            return !nodes.includes(e.id()) && e.scratch().branch === 'right'
        })
        .style({
            "background-color": "red" 
        })


        cy.nodes().filter((e) => {
            return e.id().length > 8
        })
        .style({
            height: 100,
            width: 100,
        })
    })

    return (
        <div>
            <div style={cyStyle} id="cy" />
        </div>
    );
}

export default DecisionTree;