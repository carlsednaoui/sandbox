function dSimple(selector) {
  var width = 1080;
  var height = 500;
  var radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
    .range(["#A767BF", "#D09678", "#4386CC", "#62C572", "#5FCDC3", "#D75B42", "#E19655"]);

  var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 100)
  ;

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.emails; })
  ;

  var chart = d3.select(selector)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  ;

  d3.json("/d3/data/pie-chart-simple.json", function(error, json) {
    var data = json.data;

    var g = chart.selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc")
    ;

    g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.day); })
    ;

    g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .attr("class", "arc-label")
      .text(function(d) {
        // don't show labels if there's not enough space for them
        if (d.endAngle - d.startAngle < .25) return;
        return d.data.day + ": " + d.data.emails;
      })
    ;

  });
}
dSimple(".d-simple");
