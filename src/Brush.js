import React, { Component } from 'react';
import { select, event } from 'd3-selection';
import { max, extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { brushX } from 'd3-brush';
import { axisBottom } from 'd3-axis';
import { area } from 'd3-shape';

class Brush extends Component {
  constructor(props) {
    super(props);
    this.createBrush = this.createBrush.bind(this);
  }

  componentDidMount() {
    this.createChart();
    this.updateBrush();
  }

  componentDidUpdate() {
    this.updateBrush();
  }

  createChart() {
    const node = this.node;
    const rootSvgSelection = select(node);
    const brushGroupSelection = rootSvgSelection.append('g').attr('class', 'brushGroup');

    // Use the margin convention
    //const margin = { top: 50, right: 50, bottom: 50, left: 50 },

    brushGroupSelection.attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')');

    //this.setState({ rootSvgSelection, barGroupSelection }, () => this.updateBarChart());
    this.setState({ rootSvgSelection, brushGroupSelection });
  }

  updateBrush() {
    // const width = this.props.size[0] - this.props.margin.left - this.props.margin.right;
    // const height = this.props.size[1] - this.props.margin.top - this.props.margin.bottom;
    // const xScale = scaleTime().range([0, width]);
    // // const yScale = scaleLinear().range([height, 0]);
    // const xAxis = axisBottom(xScale);
    // const xAxis = this.brushGroupSelection
    //   .append('g')
    //   .attr('class', 'x-axis')
    //   .attr('transform', 'translate(0,' + height + ')');
    // const area = area;
    // const areaPath = this.brushGroupSelection.append('path').attr('fill', '#ccc');
    // const brushed = () => {
    //   if (event.sourceEvent && event.sourceEvent.type === 'zoom') return;
    //   const s = event.selection || xScale.range();
    //   xScale.domain(s.map());
    //   this.props.change();
    // };
    // // Initialize brush component
    // const brush = brushX()
    //   // .handleSize(10)
    //   .extent([[0, 0], [width, height]])
    //   .on('brush end', brushed);
    // // Append brush component
    // const brushComponent = this.brushGroupSelection
    //   .append('g')
    //   .attr('class', 'brush')
    //   .call(brush);
    // xScale.domain(
    //   extent(this.props.data, function(d) {
    //     return d.date;
    //   })
    // );
    // yScale.domain([
    //   0,
    //   max(this.props.data, function(d) {
    //     return d['close'];
    //   }),
    // ]);
    // const brushFn = this.props.changeBrush;
    // function brushed() {
    //   const selectedExtent = event.selection.map(d => scale.invert(d));
    //   brushFn(selectedExtent);
    // }
  }

  render() {
    return <svg ref={node => (this.node = node)} width={this.props.size[0]} height={50} />;
  }
}

export default Brush;
