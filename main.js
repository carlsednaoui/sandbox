console.log('sandbox is working!');

////////////
// tutorials
////////////

// http://chimera.labs.oreilly.com/books/1230000000345/ch06.html
// https://github.com/mbostock/d3/wiki/Tutorials


////////////
// charts to learn
////////////

// Bar chart with two data
// Stacked bar chart with diff colors: http://bl.ocks.org/mbostock/3886208 OR http://bl.ocks.org/mbostock/1134768

// Horizontal bar chart: http://bl.ocks.org/mbostock/7331260

// Line chart: http://bl.ocks.org/mbostock/3883245
// Line chart with multiple data: http://bl.ocks.org/mbostock/3884955
// Line chart with two axes

// Area line chart: http://bl.ocks.org/mbostock/3883195
// Area line chart with multiple data
// Area line chart with two axes
// Stacked area chart: http://bl.ocks.org/mbostock/3020685

// Doughnut chart: http://bl.ocks.org/mbostock/3887193
// Pie chart: http://bl.ocks.org/mbostock/3887235

// Scatter plot: http://bl.ocks.org/mbostock/3887118

// Heat map chart: http://bl.ocks.org/mbostock/3202354
// Heat map with numbers inside + scale


///////////
// D3 learning begins
///////////

// #1: bar chart

// // get the data
// var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
//                 11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

// // define svg height and width
// var w = 500;
// var h = 100;
// var barPadding = 2;

// // create the svg element
// var svg = d3.select('body')
//   .append('svg')
//   .attr('width', w)
//   .attr('height', h)
// ;

// // create rects to add the data
// svg.selectAll('rect')
//  .data(dataset)
//  .enter()
//  .append('rect')
//  .attr({
//     x: function(d, i) { return i * (w / dataset.length); },
//     y: function(d) { return h - (d * 4); },
//     width: w / dataset.length - barPadding,
//     height: function(d) { return d * 4; },
//     fill: function(d) { return "rgb(0, 0, " + (d * 10) + ")"; }
//   })
// ;

// // add text labels
// svg.selectAll('text')
//   .data(dataset)
//   .enter()
//   .append('text')
//   .text(function (d) {
//     return d;
//   })
//   .attr({
//     'text-anchor': 'middle',
//     x: function(d, i) {
//       return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
//     },
//     y: function(d) {
//       return h - (d * 4) + 14;
//     },
//     'font-family': 'sans-serif',
//     'font-size': '11px',
//     fill: 'white'
//   })
// ;


// #1: bar chart

// var width = 420;
// var barHeight = 20;

// var _scale = d3.scale
//   .linear()
//   .range([0, width]);

// var chart = d3.select(".bar-chart")
//   .attr("width", width);

// d3.csv("data/d3-bar-data.csv")
//   .row(function(d) { return {key: d.name, value: +d.value}; })
//   .get(function(error, data) {
//     _scale.domain([0, d3.max(data, function(d) { return d.value; })]);
//     chart.attr("height", barHeight * data.length);

//     var bar = chart.selectAll("g")
//       .data(data)
//       .enter()
//       .append("g")
//       .attr("transform", function(d, i) {
//         return "translate(0," + i * barHeight + ")";
//       });

//     bar.append("rect")
//       .attr("width", function(d) { return _scale(d.value); })
//       .attr("height", barHeight - 1);

//     bar.append("text")
//       .attr("x", function(d) { return _scale(d.value) - 3; })
//       .attr("y", barHeight / 2)
//       .attr("dy", ".35em")
//       .text(function(d) { return d.value; });
// });

var width = 1080;
var height = 100;
var barPadding = 10;
var labelStyles = {
  inRange: {
    position: 0
    , color: "white"
  },
  outOfRange: {
    // if the bar chart is too small to show labels, place these above the chart
    // and change the text color to a darker one (for visibility purposes)
    position: -28
    , color: "#8b8b8b"
  }
};

var _scale = d3.scale
  .linear()
  .range([height, 0]);

var chart = d3.select(".bar-chart")
  .attr("width", width)
  .attr("height", height);

d3.csv("data/d3-bar-data.csv")
  // map the CSV data to key / value pairs
  // remember to coerce the value to a number since CSV data defaults to string 
  .row(function(d) { return {key: d.name, value: +d.value}; })
  .get(function(error, data) {
    _scale.domain([0, d3.max(data, function(d) { return d.value; })]);
    var barWidth = width / data.length;

    var bar = chart.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        // the first value positions the bars along the X axis
        // the second value drops the bars by 2px so that we can use rx / ry
        // to get rounded top corners
        return "translate(" + i * barWidth + ", 2)";
      });

    // create the bar chart
    bar.append("rect")
      .attr("y", function(d) { return _scale(d.value); })
      .attr("height", function(d) { return height - _scale(d.value); })
      .attr("width", barWidth - barPadding)
      .attr("rx", 2)
      .attr("ry", 2);

    // add the values to the bar chart
    bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) {
        var defaultPosition = _scale(d.value) + 10;
        if (defaultPosition > (height - 20)) {
          return defaultPosition + labelStyles.outOfRange.position;
        } else {
          return defaultPosition + labelStyles.inRange.position;
        }
      })
      .attr("dy", "1em")
      .attr("fill", function(d) {
        var defaultPosition = _scale(d.value) + 10;
        if (defaultPosition > (height - 20)) {
          return labelStyles.outOfRange.color;
        } else {
          return labelStyles.inRange.color;
        }
      })
      .text(function(d) { return d.value; });
});
