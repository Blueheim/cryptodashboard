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
import { pie, arc } from 'd3-shape';
import { zoom, zoomIdentity } from 'd3-zoom';
import { interpolate } from 'd3-interpolate';

class DonutChart extends Component {
  state = {
    svgWidth: 0,
    svgHeight: 0,
    rootSvgSelection: null,
    lineGroupSelection: null,
    brushGroupSelection: null,
    width: 0,
    height: 0,
    pieLayout: null,
    arcGenerator: null,
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
    const pieGroupSelection = rootSvgSelection.append('g').attr('class', 'pieGroup');

    const t = transition().duration(500);

    let svgWidth = 0,
      svgHeight = 0;
    if (!this.props.size[0]) {
      svgWidth = parentRect.width;
    } else {
      svgWidth = this.props.size[0];
    }

    if (!this.props.size[1]) {
      svgHeight = parentRect.height;
    } else {
      svgHeight = this.props.size[1];
    }

    const width = svgWidth - this.props.margin.left - this.props.margin.right;
    const height = svgHeight - this.props.margin.top - this.props.margin.bottom;
    const radius = Math.min(width, height) / 2.2;

    pieGroupSelection.attr('transform', 'translate(' + svgWidth / 2 + ',' + svgHeight / 2 + ')');

    const pieLayout = pie()
      .padAngle(0.03)
      .value(this.props.accessorFn)
      .sort(null); // disable sort of for smooth element transition (keeps object position in array)

    const arcGenerator = arc()
      .innerRadius(radius - 60)
      .outerRadius(radius - 30)
      .cornerRadius(0);

    pieGroupSelection
      .append('text')
      .attr('y', -height / 2.2)
      .attr('x', 0)
      .attr('font-size', '15px')
      .attr('text-anchor', 'middle')
      .text(this.props.title);

    //this.setState({ rootSvgSelection, barGroupSelection }, () => this.updateBarChart());
    this.setState({
      svgWidth,
      svgHeight,
      rootSvgSelection,
      pieGroupSelection,
      width,
      height,
      pieLayout,
      arcGenerator,
      t,
    });
  };

  findNeighborArc = (i, data0, data1, key) => {
    const preceding = this.findPreceding(i, data0, data1, key);
    const following = this.findFollowing(i, data0, data1, key);
    return preceding
      ? { startAngle: preceding.endAngle, endAngle: preceding.endAngle }
      : following
      ? { startAngle: following.startAngle, endAngle: following.startAngle }
      : null;
  };

  // Find the element in data0 that joins the highest preceding element in data1.
  findPreceding = (i, data0, data1, key) => {
    var m = data0.length;
    while (--i >= 0) {
      var k = key(data1[i]);
      for (var j = 0; j < m; ++j) {
        if (key(data0[j]) === k) return data0[j];
      }
    }
  };

  // Find the element in data0 that joins the lowest following element in data1.
  findFollowing = (i, data0, data1, key) => {
    var n = data1.length,
      m = data0.length;
    while (++i < n) {
      var k = key(data1[i]);
      for (var j = 0; j < m; ++j) {
        if (key(data0[j]) === k) return data0[j];
      }
    }
  };

  arcTween = d => {
    var i = interpolate(this._current, d);
    this._current = i(1);
    return t => {
      return this.state.arcGenerator(i(t));
    };
  };

  updateChart = () => {
    let keys = [];
    for (let data of this.props.data) {
      keys.push(data.coin);
    }
    this.props.color.domain(keys);

    const oldSlices = this.state.pieGroupSelection.selectAll('g.arcGroup path').data();
    const newSlices = this.state.pieLayout(this.props.data, this.props.keyFn);

    // JOIN elements with new data.
    const arcGroupPaths = this.state.pieGroupSelection.selectAll('g.arcGroup path').data(newSlices);

    // EXIT old elements from the screen.
    arcGroupPaths
      .exit()
      .datum(function(d, i) {
        return this.findNeighborArc(i, oldSlices, newSlices, this.props.keyFn) || d;
      })
      .transition()
      .duration(750)
      .attrTween('d', this.arcTween)
      .remove();

    // UPDATE elements still on the screen.
    arcGroupPaths
      .transition()
      .duration(750)
      .attrTween('d', this.arcTween);

    // ENTER new elements in the array.
    arcGroupPaths
      .enter()
      .append('path')
      .each((d, i) => {
        this._current = this.findNeighborArc(i, oldSlices, newSlices, this.props.keyFn) || d;
      })
      .attr('fill', d => {
        return this.props.color(this.props.keyFn(d));
      })
      .transition()
      .duration(750)
      .attrTween('d', this.arcTween);
  };

  render() {
    return <svg ref={node => (this.node = node)} width={this.state.svgWidth} height={this.state.svgHeight} />;
  }
}

export default DonutChart;
