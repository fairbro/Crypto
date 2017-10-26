import React, { Component } from "react";
import "./LineChart.css";

class LineChart extends Component {
  getMinX() {
    const { data } = this.props;
    return data[0].x;
  }

  getMaxX() {
    const { data } = this.props;
    return data[data.length - 1].x;
  }

  getMinY() {
    const { data } = this.props;
    return data.reduce((min, p) => (p.y < min ? p.y : min), data[0].y);
  }

  getMaxY() {
    const { data } = this.props;
    return data.reduce((max, p) => (p.y > max ? p.y : max), data[0].y);
  }

  getSvgX(x) {
    const { svgWidth } = this.props;
    return x / this.getMaxX() * svgWidth;
  }

  getSvgY(y) {
    const { svgHeight } = this.props;
    const maxY = this.getMaxY();
    const minY = this.getMinY();
    const range = Math.abs(maxY - minY);
    return (maxY - y) / range * svgHeight;
  }

  findXIntersection(point1, point2, yValue) {
    const slope = Math.abs((point2.y - point1.y) / (point2.x - point1.x));

    const xValue = Math.abs(point1.y - yValue) / slope + point1.x;

    return xValue;
  }

  createSections(data) {
    var initialY = data[0].y;

    var trendPositive = data[1].y >= data[0].y;
    let sections = [];
    let newArray = "";
    newArray += `${this.getSvgX(0)}, ${this.getSvgY(initialY)} `;

    for (var i = 1; i < data.length; i++) {
      var crossesLine =
        (data[i].y < initialY && initialY < data[i - 1].y) ||
        (data[i].y > initialY && initialY > data[i - 1].y);

      if (!crossesLine) {
        newArray += `${this.getSvgX(data[i].x)}, ${this.getSvgY(data[i].y)} `;
      } else {
        var xPosition = this.findXIntersection(data[i - 1], data[i], initialY);
        newArray += `${this.getSvgX(xPosition)}, ${this.getSvgY(initialY)} `;

        sections.push({
          color: trendPositive ? "#32CD32" : "#FF0000",
          section: newArray
        });

        trendPositive = !trendPositive;
        newArray = "";
        newArray += `${this.getSvgX(xPosition)}, ${this.getSvgY(initialY)} `;
        newArray += `${this.getSvgX(data[i].x)}, ${this.getSvgY(data[i].y)} `;
      }
    }

    newArray += `${this.getSvgX(data[data.length - 1].x) + 10}, ${this.getSvgY(
      initialY
    )} `;

    sections.push({
      color: trendPositive ? "#32CD32" : "#FF0000",
      section: newArray
    });

    return sections;
  }

  makePath(data) {
    var { color } = this.props;
    color = "#babebe";
    var sections = this.createSections(data);

    // let paths = sections.map((path, i) => {
    //   return  path.section.map((point, j) => {
    //     return this.getSvgX(point.x) + "," + this.getSvgY(point.y) + " ";
    //   });
    // });

    var lines = sections.map((section, i) => {
      return (
        <polyline
          key={i}
          fill={section.color}
          fillOpacity="0.5"
          stroke={section.color}
          strokeWidth="3"
          points={section.section}
        />
      );
    });

    return <g>{lines}</g>;
  }

  makeInitialPriceLine() {
    const { data } = this.props;
    const yAxis = this.getSvgY(data[0].y);
    console.log(yAxis);
    const minX = this.getMinX(),
      maxX = this.getMaxX();

    return (
      <g className="initialprice_line">
        <line
          x1={this.getSvgX(minX)}
          y1={yAxis}
          x2={this.getSvgX(maxX)}
          y2={yAxis}
        />
      </g>
    );
  }

  makeAxis() {
    const minX = this.getMinX(),
      maxX = this.getMaxX();
    const minY = this.getMinY(),
      maxY = this.getMaxY();

    return (
      <g className="linechart_axis">
        <line
          x1={this.getSvgX(minX)}
          y1={this.getSvgY(minY)}
          x2={this.getSvgX(minX)}
          y2={this.getSvgY(maxY)}
        />
      </g>
    );
  }

  getCoords(e) {
    var lineChart = document.getElementById("lineChart");
    var priceMarker = document.getElementById("priceMarker");
    var rect = lineChart.getBoundingClientRect();

    priceMarker.setAttribute("cx", e.clientX);
    var t = 3;
    console.log(
      "Rect left:",
      rect.left,
      "Rect right:",
      rect.right,
      "mouse left:",
      e.clientX,
    );
  }

  render() {
    const { data, svgHeight, svgWidth } = this.props;

    return (
      <div>
        <span id="geek" />
        <svg
          id="lineChart"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          onMouseMove={e => this.getCoords(e)}
        >
          {this.makeInitialPriceLine()}
          {this.makePath(data)}
          <circle id="priceMarker" cx="5" cy="5" r="4" />
        </svg>
        <div>
          Powered by <a href="https://api.cryptowat.ch">Cryptowatch</a>
        </div>
      </div>
    );
  }
}

LineChart.defaultProps = {
  data: [],
  color: "#32CD32",
  negativeColor: "#ff0000",
  svgHeight: 200,
  svgWidth: 600
};

export default LineChart;
