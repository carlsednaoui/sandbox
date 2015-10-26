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


// Render charts
plotLineChart('svg#line-chart');
plotScatterChart('svg#scatterplot-chart');
