import * as React from 'react';
import * as d3 from 'd3';

interface DecisionTreeProps {
  data: any;
  height: number,
  width: number
}

interface DecisionTreeState {
  svg: any;
  tree: any;
}

export default class DecisionTree extends React.Component<DecisionTreeProps, DecisionTreeState> {
  private treeContainer: any;

  componentDidMount() {
    this.state = {
      svg: d3.select(this.treeContainer),
      tree: d3.tree().size([this.props.height, this.props.width - 10])
    };

    const root = d3.hierarchy(this.props.data);
    const nodes = this.state.tree(root);
    const links = nodes.links();
    const linkPathGenerator = d3.linkVertical().x(d => d.x).y(d => d.y);

    this.state.svg.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', linkPathGenerator);

    this.state.svg.selectAll('.node')
      .data(nodes.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    this.state.svg.selectAll('.node')
      .append('circle')
      .attr('r', 5);

    this.state.svg.selectAll('.node')
      .append('text')
      .attr('dy', '0.32em')
      .attr('x', d => d.children ? -10 : 10)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.name);

    const treeHeight = nodes.descendants().map(d => d.y).sort((a, b) => b - a)[0];
    const svgHeight = this.props.height;
    const treeY = (svgHeight - treeHeight)/2 + 2;
    
    this.state.svg.selectAll('.node')
      .attr('transform', d => `translate(${d.x}, ${d.y+ treeY})`);

  }

  render() {
    return (
      <svg ref={el => this.treeContainer = el} width={this.props.width} height={this.props.height + 10}>
      </svg>
    );
  }
}