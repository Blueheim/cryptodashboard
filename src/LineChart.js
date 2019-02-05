import React, { Component } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { min, max, sum, range, extent, bisector } from 'd3-array';
import { line, curveMonotoneX } from 'd3-shape';
import { randomUniform } from 'd3-random';
import { select, mouse } from 'd3-selection';
import { legendColor } from 'd3-svg-legend';
import { transition } from 'd3-transition';
import { axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { brushX } from 'd3-brush';
import { event } from 'd3-selection';
import { area } from 'd3-shape';
import { zoom, zoomIdentity } from 'd3-zoom';

class LineChart extends Component {
  state = {
    svgWidth: 0,
    svgHeight: 0,
    rootSvgSelection: null,
    lineGroupSelection: null,
    brushGroupSelection: null,
    width: 0,
    height: 0,
    height2: 0,
    xScale: null,
    xScale2: null,
    yScale: null,
    yScale2: null,
    yLabel: '',
    t: null,
  };

  // constructor(props) {
  //   super(props);
  //   // this.createBarChart = this.createBarChart.bind(this);
  //   // this.updateBarChart = this.updateBarChart.bind(this);
  // }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  createChart = () => {
    const node = this.node;
    const parentRect = node.parentNode.getBoundingClientRect();
    const rootSvgSelection = select(node);
    // this.svgEl = document.getElementById(this.svgId);
    // this.svgElWidth = Math.round(this.svgEl.getBoundingClientRect().width);
    // this.svgElHeight = Math.round(this.svgEl.getBoundingClientRect().height);
    const lineGroupSelection = rootSvgSelection.append('g').attr('class', 'lineGroup');
    const brushGroupSelection = rootSvgSelection.append('g').attr('class', 'brushGroup');

    const t = transition().duration(500);

    let svgWidth = 0,
      svgHeight = this.props.size[1];
    if (!this.props.size[0]) {
      svgWidth = parentRect.width;
    } else {
      svgWidth = this.props.size[0];
    }

    const width = svgWidth - this.props.margin.left - this.props.margin.right;
    const height = svgHeight - this.props.margin.top - this.props.margin.bottom;

    const height2 = svgHeight - this.props.margin2.top - this.props.margin2.bottom;

    lineGroupSelection.attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')');
    brushGroupSelection.attr('transform', 'translate(' + this.props.margin2.left + ',' + this.props.margin2.top + ')');

    lineGroupSelection
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', '#ffab00');

    rootSvgSelection
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);

    const xScale = scaleTime().range([0, width]);
    const xScale2 = scaleTime().range([0, width]);
    const yScale = scaleLinear().range([height, 0]);
    const yScale2 = scaleLinear().range([height2, 0]);

    lineGroupSelection
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')');

    lineGroupSelection.append('g').attr('class', 'y-axis');

    brushGroupSelection
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height2 + ')');

    brushGroupSelection
      .append('path')
      .attr('class', 'area')
      .attr('fill-opacity', 0.5);

    brushGroupSelection.append('g').attr('class', 'brush');

    const yLabel = lineGroupSelection
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'translate(0,' + height / 2 + ') rotate(-90)')
      .attr('y', 0)
      .attr('x', 0)
      .attr('dy', '-70')
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle');

    rootSvgSelection
      .append('rect')
      .attr('class', 'zoom')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', `translate(${this.props.margin.left}, ${this.props.margin.top})`);

    //this.setState({ rootSvgSelection, barGroupSelection }, () => this.updateBarChart());
    this.setState({
      svgWidth,
      svgHeight,
      rootSvgSelection,
      lineGroupSelection,
      brushGroupSelection,
      width,
      height,
      height2,
      xScale,
      xScale2,
      yScale,
      yScale2,
      yLabel,
      t,
    });
  };

  // joinNewData = () => {
  //   // JOIN new data with old elements
  //   this.state.lineGroupSelection.selectAll('rect.bar').data(this.props.data);
  // };

  // removeOldElements = () => {
  //   // EXIT old elements not present in new data
  //   this.state.lineGroupSelection
  //     .selectAll('rect.bar')
  //     .data(this.props.data)
  //     .exit()
  //     .remove();
  // };

  updateChart = () => {
    // The number of datapoints

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    // var dataset = range(n).map(function(d) {
    //   return { y: randomUniform(1)() };
    // });

    const bisectDate = bisector(function(d) {
      return new Date(d.time);
    }).left;

    // Scales

    //x

    let keys = Object.keys(this.props.data);

    this.props.color.domain(keys);

    this.state.xScale.domain(
      extent(this.props.data[this.props.coin][this.props.currency], function(d) {
        return new Date(d.time);
      })
    );

    this.state.xScale2.domain(this.state.xScale.domain());

    // y

    // this.state.yScale
    //   .domain([
    //     min(this.props.data[keys[0]][this.props.currency], d => {
    //       return d[this.props.criteria];
    //     }),
    //     max(this.props.data[keys[0]][this.props.currency], d => {
    //       return d[this.props.criteria];
    //     }),
    //   ])
    //   .nice();

    // this.state.yScale
    //   .domain([
    //     min(this.props.data[keys[0]][this.props.currency], d => {
    //       return d[this.props.criteria];
    //     }),
    //     max(this.props.data[keys[0]][this.props.currency], d => {
    //       return d[this.props.criteria];
    //     }),
    //   ])
    //   .nice();

    let minY = min(this.props.data[this.props.coin][this.props.currency], d => {
      return d[this.props.criteria];
    });

    //minY = minY < 1 ? 0 : minY;

    this.state.yScale
      .domain([
        minY,
        max(this.props.data[this.props.coin][this.props.currency], d => {
          return d[this.props.criteria];
        }),
      ])
      .nice();

    this.state.yScale2.domain(this.state.yScale.domain()).nice();

    // axis

    const xAxis = axisBottom(this.state.xScale).tickFormat(timeFormat('%d-%m-%Y'));

    const xAxis2 = axisBottom(this.state.xScale2).tickFormat(timeFormat('%d-%m-%Y'));

    const yAxis = axisLeft(this.state.yScale).tickSize(-this.state.width);

    // Update y-axis label
    this.state.yLabel.text(`${this.props.criteria} (${this.props.currency})`);

    const sline = line()
      .x(d => {
        return this.state.xScale(new Date(d.time));
      })
      .y(d => {
        return this.state.yScale(d[this.props.criteria]);
      })
      .curve(curveMonotoneX);

    const brushed = () => {
      if (event.sourceEvent && event.sourceEvent.type === 'zoom') return;

      if (event.sourceEvent) {
        const s = event.selection || this.state.xScale2.range();
        this.state.xScale.domain(s.map(this.state.xScale2.invert, this.state.xScale2));
        this.state.lineGroupSelection
          .select('.line')
          .attr('d', sline(this.props.data[this.props.coin][this.props.currency]));
        this.state.lineGroupSelection.select('.x-axis').call(xAxis);
        this.state.rootSvgSelection
          .select('.zoom')
          .call(zoomFocus.transform, zoomIdentity.scale(this.state.width / (s[1] - s[0])).translate(-s[0], 0));
      }
    };

    const brush = brushX()
      .extent([[0, 0], [this.state.width, this.state.height2]])
      .on('brush', brushed);

    const areaBrush = area()
      .curve(curveMonotoneX)
      .x(d => this.state.xScale2(new Date(d.time)))
      .y0(this.state.height2)
      .y1(d => this.state.yScale2(d[this.props.criteria]));

    this.state.lineGroupSelection.select('.x-axis').call(xAxis); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    this.state.lineGroupSelection
      .select('.y-axis')
      .call(yAxis)
      .select('.domain')
      .remove();

    this.state.lineGroupSelection
      .select('.y-axis')
      //.selectAll('.tick:not(:first-of-type) line')
      .selectAll('.tick line')
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '2.2');

    this.state.lineGroupSelection
      .select('.line')
      .transition(this.state.t)
      .attr('stroke', d => this.props.color(this.props.coin))
      .attr('d', sline(this.props.data[this.props.coin][this.props.currency])); // 11. Calls the line generator

    // Brush

    this.state.brushGroupSelection
      .select('.x-axis')
      .transition(this.state.t)
      .call(xAxis2);

    this.state.brushGroupSelection
      .select('.area')
      .transition(this.state.t)
      .attr('fill', d => this.props.color(this.props.coin))
      .attr('d', areaBrush(this.props.data[this.props.coin][this.props.currency]));

    this.state.brushGroupSelection
      .select('.brush')
      .call(brush)
      .call(brush.move, this.state.xScale.range());

    const zoomed = () => {
      if (event.sourceEvent && event.sourceEvent.type === 'brush') return;

      if (event.sourceEvent) {
        const t = event.transform;
        this.state.xScale.domain(t.rescaleX(this.state.xScale2).domain());
        this.state.lineGroupSelection
          .select('.line')
          .attr('d', sline(this.props.data[this.props.coin][this.props.currency]));
        this.state.lineGroupSelection.select('.x-axis').call(xAxis);
        this.state.brushGroupSelection.select('.brush').call(brush.move, this.state.xScale.range().map(t.invertX, t));
      }
    };

    const zoomFocus = zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.state.width, this.state.height]])
      .extent([[0, 0], [this.state.width, this.state.height]])
      .on('zoom', zoomed);

    this.state.rootSvgSelection
      .select('.zoom')
      .raise()
      .call(zoomFocus);

    // ***************************************** //

    // Discard old tooltip elements
    // select('.focus').remove();
    // select('.overlay').remove();

    // var focus = this.state.lineGroupSelection
    //   .append('g')
    //   .attr('class', 'focus')
    //   .style('display', 'none');

    // focus
    //   .append('line')
    //   .attr('class', 'x-hover-line hover-line')
    //   .attr('y1', 0)
    //   .attr('y2', this.state.height);

    // focus
    //   .append('line')
    //   .attr('class', 'y-hover-line hover-line')
    //   .attr('x1', 0)
    //   .attr('x2', this.state.width);

    // focus.append('circle').attr('r', 5);

    // focus
    //   .append('text')
    //   .attr('x', 15)
    //   .attr('dy', '.31em');

    // const mousemove = () => {
    //   var x0 = this.state.xScale.invert(mouse(event.target)[0]),
    //     i = bisectDate(this.props.data, x0, 1),
    //     d0 = this.props.data[i - 1],
    //     d1 = this.props.data[i],
    //     d = d1 && d0 ? (x0 - d0.date > d1.date - x0 ? d1 : d0) : 0;
    //   focus.attr(
    //     'transform',
    //     'translate(' + this.state.xScale(d.time) + ',' + this.state.yScale(d[this.props.criteria]) + ')'
    //   );
    //   focus.select('text').text(() => {
    //     return format('$,')(d[this.props.criteria].toFixed(2));
    //   });
    //   focus.select('.x-hover-line').attr('y2', this.state.height - this.state.yScale(d[this.props.criteria]));
    //   focus.select('.y-hover-line').attr('x2', -this.state.xScale(d.time));
    // };

    // this.state.rootSvgSelection
    //   .append('rect')
    //   .attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')')
    //   .attr('class', 'overlay')
    //   .attr('width', this.state.width)
    //   .attr('height', this.state.height);
    // .on('mouseover', function() {
    //   focus.style('display', null);
    // })
    // .on('mouseout', function() {
    //   focus.style('display', 'none');
    // })
    // .on('mousemove', mousemove);
  };

  render() {
    return <svg ref={node => (this.node = node)} width={this.state.svgWidth} height={this.state.svgHeight} />;
  }
}

export default LineChart;
