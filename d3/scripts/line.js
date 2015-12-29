
function simpleLineChart(selector) {
  var margin = {top: 20, right: 150, bottom: 80, left: 80};
  var width = 1080 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%d-%b-%y").parse;

  var x = d3.time.scale()
    .range([0, width])
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

  var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); })
  ;

  var svg = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  d3.json("/d3/data/line-chart-apple-stock.json", function(error, json) {
    var data = json.data;

    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.price = +d.price;
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.price; }));

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    ;

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)")
    ;

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
    ;
  });
}
simpleLineChart(".simple-line-chart");



function lineChartRoundTwo(selector) {
  var margin = {top: 20, right: 150, bottom: 80, left: 80};
  var width = 1080 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangePoints([0, width], 0)
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

  var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.emails); })
    .interpolate("monotone") // smooth that line, bro
  ;

  var chart = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  d3.json("/d3/data/line-chart-one-company.json", function(error, json) {
    var data = json.data;

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.emails; })]);

    chart.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
    ;

    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    ;

    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    ;

    chart.append("g")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .classed("data-label", true)
      .attr("y", function(d, i) {
        return y(d.emails);
      })
      .attr("x", function(d, i) {
        return x(d.date);
      })
      .attr("dx", function(d, i) {
        if (i == 0) return 10; // if it's the first data point, get it away form the y-axis
      })
      .attr("dy", function(d, i) {
        // get the first item out of the way
        // move all other items above the line
        if (i == 0) return -20;
        return -10;
      })
      .text(function(d, i) {
        return d.emails;
      });
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
lineChartRoundTwo(".line-chart-round-two");
