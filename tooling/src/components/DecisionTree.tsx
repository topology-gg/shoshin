import React from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use( dagre );

interface DecisionTreeProps {
    data: any,
    height: number,
    width: number,
}

export default class DecisionTree extends React.Component<DecisionTreeProps, {}>{
    private cy: any;

    constructor(props) {
        super(props);
        this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
    }

    renderCytoscapeElement() {
        console.log('* Cytoscape.js is rendering the graph..');

        this.cy = cytoscape({
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
                nodes: this.props.data.nodes,
                edges: this.props.data.edges,
            },
            layout: {
                name: 'breadthfirst',
                directed: true,
                padding: 10,
            },
        });
        
        let data = []
        this.cy.edges().map((e, i, eles) => {
            let id = e.source().id()
            if (! data.includes(id)) {
                data.push(id)
            }
            return 0
        })

        this.cy.nodes().filter((e) => {
            return !data.includes(e.id()) && e.scratch().branch === 'left'
        })
        .style({
            "background-color": "green" 
        })

        this.cy.nodes().filter((e) => {
            return !data.includes(e.id()) && e.scratch().branch === 'right'
        })
        .style({
            "background-color": "red" 
        })

        this.cy.nodes().filter((e) => {
            return e.id().length > 8
        })
        .style({
            height: 100,
            width: 100,
        })
    }

    componentDidMount() {
        this.renderCytoscapeElement();
    }

    render() {
        let cyStyle = {
            height: this.props.height,
            width: this.props.width,
            margin: '20px 0px',
        };

        return (
            <div>
                <div style={cyStyle} id="cy" />
            </div>
        );
    }
}
