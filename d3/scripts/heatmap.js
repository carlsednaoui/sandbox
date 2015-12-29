function simpleHeatmapChart(selector) {
  var margin = {top: 20, right: 150, bottom: 80, left: 80};
  var width = 1080 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangePoints([0, width], 0)
  ;

  var y = d3.scale.ordinal()
    .rangePoints([0, width], 0)
  ;

  var z = d3.scale.linear()
    .range(["white", "steelblue"])
  ;

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
  ;

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
  ;

  var svg = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  d3.json("/d3/data/heatmap-chart-simple.json", function(error, json) {
    var data = json.data;

    x.domain(d3.extent(data, function(d) { return d.day; }));
    y.domain(d3.extent(data, function(d) { return d.time; }));
    z.domain([0, d3.max(data, function(d) { return d.emails; })]);

    svg.selectAll(".tile")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "tile")
      .attr("x", function(d) { return x(d.day); })
      .attr("y", function(d) { return y(d.time); })
      // .attr("width", x(xStep) - x(0))
      // .attr("height",  y(0) - y(yStep))
      .attr("width", 100)
      .attr("height",  100)
      .style("fill", function(d) { return z(d.emails); })
    ;

    // Add an x-axis with label.
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      ;

      // Add a y-axis with label.
      svg.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"))
      ;


  //   svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis)
  //   ;

  //   svg.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis)
  //     .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("Price ($)")
  //   ;

  //   svg.append("path")
  //     .datum(data)
  //     .attr("class", "line")
  //     .attr("d", line)
  //   ;
  });
}
simpleHeatmapChart(".simple-heatmap-chart");