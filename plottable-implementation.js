function plotLineChart(selector) {
  var xScale = new Plottable.Scales.Linear();
  var yScale = new Plottable.Scales.Linear();

  var xAxis = new Plottable.Axes.Numeric(xScale, 'bottom');
  var yAxis = new Plottable.Axes.Numeric(yScale, 'left');

  var plot = new Plottable.Plots.Line();

  plot.x(function(d) { return d.x; }, xScale);
  plot.y(function(d) { return d.y; }, yScale);

  var data = [
    { "x": 0, "y": 1 },
    { "x": 1, "y": 2 },
    { "x": 2, "y": 4 },
    { "x": 3, "y": 8 }
  ];

  var dataset = new Plottable.Dataset(data);

  plot.addDataset(dataset);

  var chart = new Plottable.Components.Table([
    [yAxis, plot],
    [null, xAxis]
  ]);

  chart.renderTo(selector);
};


function plotScatterChart(selector) {
  // Format: { "x": 1, "y": 1, "radius": 1, "stroke": "#FF0000" }
  var data = [];
  var colors = ["#C7254E", "#009CDE"];
  for (var i = 2; i < 10; i++) {
    data.push({ "x": i, "y": i, "radius": Math.pow(i, 2), "stroke": colors[i % colors.length] });
  }

  var xScale = new Plottable.Scales.Linear();
  var yScale = new Plottable.Scales.Linear();

  var xAxis = new Plottable.Axes.Numeric(xScale, 'bottom');
  var yAxis = new Plottable.Axes.Numeric(yScale, 'left');

  var plot = new Plottable.Plots.Scatter();
  plot.x(function(d) { return d.x; }, xScale);
  plot.y(function(d) { return d.y; }, yScale);
  plot.addDataset(new Plottable.Dataset(data));

  // customize the scatterplot
  plot.size(function(d) { return d.radius; });
  plot.attr('stroke', function(d) { return d.stroke; });
  plot.attr('stroke-width', 3);

  var chart = new Plottable.Components.Table([
    [yAxis, plot],
    [null, xAxis]
  ]);

  // Plot with axis
  chart.renderTo(selector);

  // Plot without axis
  // plot.renderTo(selector);
};


function plotDoubleBarChart(selector) {
  var colorScale = new Plottable.Scales.Color();
  var xScale = new Plottable.Scales.Linear();
  var xAxis = new Plottable.Axes.Numeric(xScale, 'bottom');

  var yScaleSenate = new Plottable.Scales.Linear();
  var yAxisSenate = new Plottable.Axes.Numeric(yScaleSenate, 'left');
  var plotSenate = new Plottable.Plots.Bar();

  plotSenate.x(function(d) { return d.start_year; }, xScale);
  plotSenate.y(function(d) {return d.democrats - d.republicans; }, yScaleSenate);
  plotSenate.attr('fill', function(d) {return d.democrats - d.republicans > 0 ? 
    "#0000FF" : "#FF0000"}, colorScale);
  var labelSenate = new Plottable.Components.AxisLabel('Senate', -90);


  var yScaleHouse = new Plottable.Scales.Linear();
  var yAxisHouse = new Plottable.Axes.Numeric(yScaleHouse, 'left');
  var plotHouse = new Plottable.Plots.Bar()
    .x(function(d) { return d.start_year; }, xScale)
    .y(function(d) { return d.democrats - d.republicans; }, yScaleHouse)
    .attr('fill', function(d) {return d.democrats - d.republicans > 0 ?
      "#0000FF" : "#FF0000"}, colorScale);
  var labelHouse = new Plottable.Components.AxisLabel('House', -90);

  var chart = new Plottable.Components.Table([
    [labelSenate, yAxisSenate, plotSenate],
    [labelHouse, yAxisHouse, plotHouse],
    [null, null, xAxis]
  ]);

  chart.renderTo(selector);

  // Load data for the Senate
  $.get("/data/senate.json", function(data) {
    plotSenate.addDataset(new Plottable.Dataset(data));
  });

  // Load data for the House
  $.get("/data/house.json", function(data) {
    plotHouse.addDataset(new Plottable.Dataset(data));
  });

  window.addEventListener("resize", function() {
    plotSenate.redraw();
    plotHouse.redraw();
  });
};


// Render charts
plotLineChart('svg#line-chart');
plotScatterChart('svg#scatterplot-chart');
plotDoubleBarChart('svg#double-bar-chart');
