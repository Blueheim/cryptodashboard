import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { max, sum } from 'd3-array';
import { select } from 'd3-selection';
import { legendColor } from 'd3-svg-legend';
import { transition } from 'd3-transition';

class BarChart extends Component {
  state = {
    rootSvgSelection: null,
    barGroupSelection: null,
  };

  // constructor(props) {
  //   super(props);
  //   // this.createBarChart = this.createBarChart.bind(this);
  //   // this.updateBarChart = this.updateBarChart.bind(this);
  // }

  componentDidMount() {
    this.createBarChart();
  }

  componentDidUpdate() {
    this.updateBarChart();
  }

  createBarChart = () => {
    console.log('call create');
    const node = this.node;
    const rootSvgSelection = select(node);
    const barGroupSelection = rootSvgSelection.append('g').attr('class', 'barGroup');

    // Legends
    const legend = legendColor()
      .scale(this.props.colorScale)
      .labels(['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4']);

    rootSvgSelection
      .selectAll('g.legend')
      .data([0])
      .enter()
      .append('g')
      .attr('class', 'legend')
      .call(legend);

    rootSvgSelection.select('g.legend').attr('transform', 'translate(' + (this.props.size[0] - 100) + ', 20)');

    //this.setState({ rootSvgSelection, barGroupSelection }, () => this.updateBarChart());
    this.setState({ rootSvgSelection, barGroupSelection });
  };

  joinNewData = () => {
    // JOIN new data with old elements
    this.state.barGroupSelection.selectAll('rect.bar').data(this.props.data);
  };

  removeOldElements = () => {
    // EXIT old elements not present in new data
    this.state.barGroupSelection
      .selectAll('rect.bar')
      .data(this.props.data)
      .exit()
      .remove();
  };

  updateBarChart = () => {
    const dataMax = max(this.props.data.map(d => sum(d.data)));
    const barWidth = this.props.size[0] / this.props.data.length;

    const yScale = scaleLinear()
      .domain([0, dataMax])
      .range([0, this.props.size[1]]);

    console.log(this.props.data, dataMax);

    this.joinNewData();

    this.removeOldElements();

    // UPDATE old elements present in new data
    this.state.barGroupSelection
      .selectAll('rect.bar')
      .data(this.props.data)
      .style('fill', (d, i) => (this.props.hoverElement === d.id ? '#FCBC34' : this.props.colorScale(d.launchday)))
      .style('stroke', 'black')
      .style('stroke-opacity', 0.25);

    // ENTER new elements present in new data
    this.state.barGroupSelection
      .selectAll('rect.bar')
      .data(this.props.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => i * barWidth)
      .attr('y', d => this.props.size[1] - yScale(sum(d.data)))
      .attr('height', d => yScale(sum(d.data)))
      .attr('width', barWidth)
      .style('fill', (d, i) => (this.props.hoverElement === d.id ? '#FCBC34' : this.props.colorScale(d.launchday)))
      .style('stroke', 'black')
      .style('stroke-opacity', 0.25)
      .on('mouseover', this.props.onHover);
  };

  render() {
    return <svg ref={node => (this.node = node)} width={this.props.size[0]} height={this.props.size[1]} />;
  }
}

export default BarChart;
