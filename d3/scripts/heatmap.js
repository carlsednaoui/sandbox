function simpleHeatmapChart(selector) {
  var margin = {top: 20, right: 150, bottom: 80, left: 80};
  var width = 1080 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangePoints([0, width], 0)
  ;

  var y = d3.scale.ordinal()
    .rangePoints([height, 0], 0)
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
    
    var xDomain = d3.map(data, function(d) { return d.day; }).values().map(function(d) {return d.day; });
    var yDomain = d3.map(data, function(d) { return d.time; }).values().map(function(d) {return d.time; }).reverse();
    x.domain(xDomain);
    y.domain(yDomain);
    z.domain([0, d3.max(data, function(d) { return d.emails; })]);

    var heatWidth = Math.floor(width / xDomain.length);
    var heatHeight = Math.floor(height / yDomain.length);

    svg.selectAll(".tile")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "tile")
      .attr("x", function(d, i) {
        // no clue why I need to manually do this — need to learn more D3
        var offset = (x.domain().length - x.domain().indexOf(d.day)) * heatWidth;
        return offset - heatWidth;
        // return x(d.day);
      })
      .attr("y", function(d, i) {
        // no clue why I need to manually do this — need to learn more D3
        var offset = (y.domain().length - y.domain().indexOf(d.time)) * heatHeight;
        return offset - heatHeight;
        // return y(d.time);
      })
      // .attr("x", function(d) { return x(d.day) - (heatWidth / 2); })
      // .attr("y", function(d) { return y(d.time) - (heatHeight / 2); })
      // .attr("width", x(xStep) - x(0))
      // .attr("height",  y(0) - y(yStep))
      .attr("width", heatWidth)
      .attr("height",  heatHeight)
      .style("fill", function(d) { return z(d.emails); })
    ;

      // add x-axis with label
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      ;

      // add a y-axis with label
      svg.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"))
      ;

      // add legend for the color values
      var legend = svg.selectAll(".legend")
        .data(z.ticks(6).slice(1).reverse())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
          return "translate(" + (width + 20) + "," + (20 + i * 20) + ")";
        })
      ;

      legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", z)
      ;

      legend.append("text")
        .attr("x", 30)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text(String)
      ;

      svg.append("text")
        .attr("class", "label")
        .attr("x", width + 35)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text("Emails")
      ;
  });
}
simpleHeatmapChart(".simple-heatmap-chart");
