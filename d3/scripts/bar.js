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

// d3.csv("/d3/data/bar-chart-data.csv")
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

function basicBarChart(selector) {
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

  var y = d3.scale
    .linear()
    .range([height, 0]);

  var chart = d3.select(selector)
    .attr("width", width)
    .attr("height", height);

  d3.csv("/d3/data/bar-chart-data.csv")
    // map the CSV data to key / value pairs
    // remember to coerce the value to a number since CSV data defaults to string 
    .row(function(d) { return {key: d.name, value: +d.value}; })
    .get(function(error, data) {
      y.domain([0, d3.max(data, function(d) { return d.value; })]);
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
        })
      ;

      // create the bar chart
      bar.append("rect")
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", barWidth - barPadding)
        .attr("rx", 2)
        .attr("ry", 2)
      ;

      // add the values to the bar chart
      bar.append("text")
        .attr("x", (barWidth - barPadding) / 2) 
        .attr("y", function(d) {
          var defaultPosition = y(d.value) + 10;
          if (defaultPosition > (height - 20)) {
            return defaultPosition + labelStyles.outOfRange.position;
          } else {
            return defaultPosition + labelStyles.inRange.position;
          }
        })
        .attr("dy", "1em")
        .attr("fill", function(d) {
          var defaultPosition = y(d.value) + 10;
          if (defaultPosition > (height - 20)) {
            return labelStyles.outOfRange.color;
          } else {
            return labelStyles.inRange.color;
          }
        })
        .text(function(d) { return d.value; })
      ;
    })
  ;
}
basicBarChart(".simple-bar-chart");


function barChartWithAxis(selector) {
  var margin = {top: 20, right: 30, bottom: 30, left: 40};
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
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

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)
  ;

  var y = d3.scale.linear()
    .range([height, 0])
  ;


  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
  ;

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
  ;


  var chart = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height",  height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("/d3/data/bar-chart-data.csv")
    // map the CSV data to key / value pairs
    // remember to coerce the value to a number since CSV data defaults to string 
    .row(function(d) { return {name: d.name, value: +d.value}; })
    .get(function(error, data) {
      x.domain(data.map(function(d) { return d.name; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);

      var bar = chart.selectAll("g")
        .data(data)
        .enter()
        .append("g");

      bar.append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x.rangeBand())
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("transform", function(d, i) {
          // drops the bars by 1px so that we can use rx / ry
          // to get rounded top corners while ensuring the bar doesn't go lower
          // than the axis
          return "translate(0, 1)";
        })
      ;

      // get the bar width from the first bar in our chart
      var barWidth = d3.select(selector).select(".bar")[0][0].width.baseVal.value;

      bar.append("text")
        .attr("x", function(d) { return x(d.name) + (barWidth / 2) })
        .attr("y", function(d) {
          var defaultPosition = y(d.value) + 10;
          if (defaultPosition > (height - 20)) {
            return defaultPosition + labelStyles.outOfRange.position;
          } else {
            return defaultPosition + labelStyles.inRange.position;
          }
        })
        .attr("dy", ".75em")
        .attr("fill", function(d) {
          var defaultPosition = y(d.value) + 10;
          if (defaultPosition > (height - 20)) {
            return labelStyles.outOfRange.color;
          } else {
            return labelStyles.inRange.color;
          }
        })
        .text(function(d) { return d.value; })
      ;

      // add bottom axis
      chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      ;

      // add left axis
      chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        // add inner left label
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Emails sent")
      ;
    })
  ;
}

barChartWithAxis(".bar-chart-with-axis");


function barChartWithLabels(selector) {
  var margin = {top: 20, right: 30, bottom: 80, left: 80};
  var width = 1080 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
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

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)
  ;

  var y = d3.scale.linear()
    .range([height, 0])
  ;


  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
  ;

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    //.tickFormat(function(d) { return d + "%"; }) // we can add % sign by using this
  ;


  var chart = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height",  height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  d3.csv("/d3/data/bar-chart-data.csv")
    // map the CSV data to key / value pairs
    // remember to coerce the value to a number since CSV data defaults to string 
    .row(function(d) { return {name: d.name, value: +d.value}; })
    .get(function(error, data) {
      x.domain(data.map(function(d) { return d.name; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);

      var bar = chart.selectAll("g")
        .data(data)
        .enter()
        .append("g");

      bar.append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x.rangeBand())
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("transform", function(d, i) {
          // drops the bars by 1px so that we can use rx / ry
          // to get rounded top corners while ensuring the bar doesn't go lower
          // than the axis
          return "translate(0, 1)";
        })
      ;

      // get the bar width from the first bar in our chart
      var barWidth = d3.select(selector).select(".bar")[0][0].width.baseVal.value;

      bar.append("text")
        .attr("x", function(d) { return x(d.name) + (barWidth / 2) })
        .attr("y", function(d) {
          var defaultPosition = y(d.value) + 10;
          if (defaultPosition > (height - 20)) {
            return defaultPosition + labelStyles.outOfRange.position;
          } else {
            return defaultPosition + labelStyles.inRange.position;
          }
        })
        .attr("dy", ".75em")
        .attr("fill", function(d) {
          var defaultPosition = y(d.value) + 10;
          if (defaultPosition > (height - 20)) {
            return labelStyles.outOfRange.color;
          } else {
            return labelStyles.inRange.color;
          }
        })
        .text(function(d) { return d.value; })
      ;

      // add bottom axis
      chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      ;

      // add left axis
      chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      ;

      // add left label
      chart.append("g")
        .attr("class", "label")
        .append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .attr("y", -50)
          .attr("x", - height / 2)
          .text("Emails sent")
      ;

      // add bottom label
      chart.append("g")
        .attr("class", "label")
        .append("text")
          .attr("text-anchor", "middle")
          .attr("y", (height + margin.top + margin.bottom) - 50) 
          .attr("x", width / 2)
          .text("Months")
      ;
    })
  ;
}

barChartWithLabels(".bar-chart-with-labels");


function barChartWithLabelsJSON(selector) {
  var margin = {top: 20, right: 30, bottom: 80, left: 80};
  var width = 1080 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
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

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)
  ;

  var y = d3.scale.linear()
    .range([height, 0])
  ;


  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
  ;

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    //.tickFormat(function(d) { return d + "%"; }) // we can add % sign by using this
  ;


  var chart = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height",  height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  d3.json("/d3/data/bar-chart-data.json", function(error, json) {
    var data = json.data;
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    var bar = chart.selectAll("g")
      .data(data)
      .enter()
      .append("g")
    ;

    bar.append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", x.rangeBand())
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("transform", function(d, i) {
        // drops the bars by 1px so that we can use rx / ry
        // to get rounded top corners while ensuring the bar doesn't go lower
        // than the axis
        return "translate(0, 1)";
      })
    ;

    // get the bar width from the first bar in our chart
    var barWidth = d3.select(selector).select(".bar")[0][0].width.baseVal.value;

    bar.append("text")
      .attr("x", function(d) { return x(d.name) + (barWidth / 2) })
      .attr("y", function(d) {
        var defaultPosition = y(d.value) + 10;
        if (defaultPosition > (height - 20)) {
          return defaultPosition + labelStyles.outOfRange.position;
        } else {
          return defaultPosition + labelStyles.inRange.position;
        }
      })
      .attr("dy", ".75em")
      .attr("fill", function(d) {
        var defaultPosition = y(d.value) + 10;
        if (defaultPosition > (height - 20)) {
          return labelStyles.outOfRange.color;
        } else {
          return labelStyles.inRange.color;
        }
      })
      .text(function(d) { return d.value; })
    ;

    // add bottom axis
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    ;

    // add left axis
    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    ;

    // add left label
    chart.append("g")
      .attr("class", "label")
      .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", - height / 2)
        .text("Emails sent")
    ;

    // add bottom label
    chart.append("g")
      .attr("class", "label")
      .append("text")
        .attr("text-anchor", "middle")
        .attr("y", (height + margin.top + margin.bottom) - 50) 
        .attr("x", width / 2)
        .text("Months")
    ;
  });
}

barChartWithLabelsJSON(".bar-chart-with-labels-json");

function horizontalBarChat(selector) {
  var margin = {top: 40, right: 10, bottom: 40, left: 10};
  var width = 540 - margin.left - margin.right;
  var height = 200 - margin.top - margin.bottom;
  var barHeight = 20;

  var chart = d3.select(selector)
    .attr("width", width)
    .attr("height", height)
  ;

  var labelStyles = {
    inRange: {
      position: 8
      , color: "white"
    },
    outOfRange: {
      // if the bar chart is too small to show the label, place the label on 
      // the right of the chart and change text color for visibility purposes
      position: -62
      , color: "#8b8b8b"
    }
  };
  var labelVisibilityThreshold = 100;

  d3.json("/d3/data/bar-chart-data-horizontal-subject-line.json", function(error, json) {
    // data needs to be inside an array so we can use the `selectAll` trick
    var data = [json.data.average_subject_line_length];

    var x = d3.scale
      .linear()
      .domain([0, json.data.max_subject_line_length])
      .range([0, width])
    ;

    var bar = chart.selectAll("g")
      .data(data)
      .enter()
      .append("g")
    ;

    // add container bar
    bar.append("rect")
      .attr("width", width)
      .attr("height", barHeight)
      .attr("class", "bar-container")
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("y", margin.top)
    ;

    // add data bar
    bar.append("rect")
      .attr("width", x(data))
      .attr("height", barHeight)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("y", margin.top)
    ;

    var barWidth = d3.select(selector).select("rect")[0][0].width.baseVal.value;
    bar.append("text")
      .attr("x", function(d) {
        if (barWidth < labelVisibilityThreshold) {
          return x(d) - labelStyles.outOfRange.position;
        } else {
          return x(d) - labelStyles.inRange.position;
        }
      })
      .attr("y", margin.top + barHeight / 2)
      .attr("dy", ".35em")
      .attr("fill", function(d) {
        if (barWidth < labelVisibilityThreshold) {
          return labelStyles.outOfRange.color;
        } else {
          return labelStyles.inRange.color;
        }
      })
      .text(function(d) { return d + " characters"; })
    ;

    // add chart title as top left label
    chart.append("g")
      .attr("class", "label title")
      .append("text")
        .attr("y", 25)
        .attr("x", 0)
        .text(json.data.chart_title)
    ;

    // add data details as top right label
    chart.append("g")
      .attr("class", "label data-details")
      .append("text")
        .attr("y", 25)
        .attr("x", barWidth)
        .text(json.data.top_right_label)
    ;

    // add data legend as bottom left label
    chart.append("g")
      .attr("class", "data-details left-text")
      .append("text")
        .attr("y", margin.top + barHeight + 20)
        .attr("x", 0)
        .text(json.data.bottom_labels[0])
    ;

    // add data legend as bottom right label
    chart.append("g")
      .attr("class", "data-details right-text")
      .append("text")
        .attr("y", margin.top + barHeight + 20)
        .attr("x", barWidth)
        .text(json.data.bottom_labels[1])
    ;
  });
}

horizontalBarChat(".horizontal-bar-chart")


function groupedBarChart(selector) {
  var margin = {top: 20, right: 150, bottom: 80, left: 80};
  var width = 1080 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
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
  
  var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)
  ;

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
    .range([height, 0])
  ;

  var color = d3.scale.ordinal()
    .range(["#A767BF", "#D09678"]);


  var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom")
  ;

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
  ;

  var chart = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height",  height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  d3.json("/d3/data/bar-chart-grouped.json", function(error, json) {
    var data = json.data;

    var companies = d3.keys(data[0]).filter(function(key) { return key !== "date"; });;

    data.forEach(function(d) {
      d.company = companies.map(function(company) { return {company: company, value: +d[company]}; });
    });

    x0.domain(data.map(function(d) { return d.date; }));
    x1.domain(companies).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.company, function(d) { return d.value; }); })]);

    var bars = chart.selectAll(".company")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "company")
      .attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; })
    ;

    bars.selectAll("rect")
      .data(function(d) { return d.company; })
      .enter()
      .append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.company); })
      .attr("y", function(d) { return y(d.value) + 1; })
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.company); })
    ;

    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    ;

    // get the bar width from the first bar in our chart
    var barWidth = d3.select(selector).select(".company rect")[0][0].width.baseVal.value;

    bars.selectAll("text")
      .data( function(d) { return d.company; })
      .enter()
      .append("text")
      .attr("x", function(d) { return x1(d.company) + (barWidth / 2) })
      .attr("y", function(d, i) {
        var defaultPosition = y(d.value) + 10;
        if (defaultPosition > (height - 20)) {
          return defaultPosition + labelStyles.outOfRange.position;
        } else {
          return defaultPosition + labelStyles.inRange.position;
        }
      })
      .attr("dy", ".75em")
      .attr("fill", function(d) {
        var defaultPosition = y(d.value) + 15;
        if (defaultPosition > (height - 20)) {
          return labelStyles.outOfRange.color;
        } else {
          return labelStyles.inRange.color;
        }
      })
      .text(function(d, i) { return d.value; });
    ;

    // add left label
    chart.append("g")
      .attr("class", "label")
      .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", - height / 2)
        .text("Emails sent")
    ;

    // add bottom label
    chart.append("g")
      .attr("class", "label")
      .append("text")
        .attr("text-anchor", "middle")
        .attr("y", (height + margin.top + margin.bottom) - 50) 
        .attr("x", width / 2)
        .text("Months")
    ;

    // create legend
    var legend = chart.selectAll(".legend")
      .data(companies.slice().reverse())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
        .attr("x", width + 18)
        .attr("width", 18)
        .attr("height", 18)
        .attr("rx", 2)
        .attr("ry", 2)
        .style("fill", color);

      legend.append("text")
        .attr("x", width + 40)
        .attr("y", 8)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) {
         // if a company has a long name
         // trim it and add ellipsis after 15 characters
          if (d.length > 15) {
            return d.slice(0, 15) + "...";
          } else {
            return d;
          }
        });
  });
}

groupedBarChart(".grouped-bar-chart");
