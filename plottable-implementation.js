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


function plotHeatmapChart(selector) {
  var daysOfWeek = ['Monday', 'Tueday', 'Wedday', 'Thuday', 'Friday', 'Satday', 'Sunday'];
  var timesOfDay = ['12am - 4am', '4am - 8am', '8am - Noon', 'Noon - 4pm', '4pm - 8pm', '8pm - Midnight'];

  // TODO: this data should be prepped by python, not looped over here
  // data comes from here https://github.com/mailcharts/reporter/blob/master/templates/1-company-report/report.jade#L66
  // https://github.com/mailcharts/reporter/blob/master/test/data/banarepublic-output.json#L83
  var data = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[1,2,2,4,2,0,3],[1,0,0,1,3,4,0],[0,0,0,0,0,0,0],[1,0,0,0,0,0,2]];
  data = data.reduce(function(memo, item, index) {
    var y = index; // 0,1,2
    item.reduce(function(ignore, val, index) {
      var x = index;
      var dayOfWeek = daysOfWeek[Math.floor(Math.random()*daysOfWeek.length)];
      var timeOfDay = timesOfDay[Math.floor(Math.random()*timesOfDay.length)];
      memo.push({ x: dayOfWeek, y: timeOfDay, val: val });
    });
    return memo;
  }, []);

  // this object should look like this
  /* {
    xScaleDomain: ['Monday', 'Tueday', 'Wedday', 'Thuday', 'Friday', 'Satday', 'Sunday'];
    yScaleDomain: ['12am - 4am', '4am - 8am', '8am - Noon', 'Noon - 4pm', '4pm - 8pm', '8pm - Midnight'];
    data: [
      { x: SOME_X_SCALE_VAL, y: SOME_Y_SCALE_VAL, val: COUNT_OF_EMAILS }
    ]
  }*/

  var xScale = new Plottable.Scales.Category();
  xScale.domain(daysOfWeek);

  var yScale = new Plottable.Scales.Category();
  yScale.domain(timesOfDay);

  var xAxis = new Plottable.Axes.Category(xScale, "bottom");
  var yAxis = new Plottable.Axes.Category(yScale, "left");

  var colorScale = new Plottable.Scales.InterpolatedColor();
  colorScale.range(["#F5F5F5", "#BFF0D3", "#1FCE6D"]);

  var plot = new Plottable.Plots.Rectangle()
    .addDataset(new Plottable.Dataset(data))
    .x(function(d) { return d.x }, xScale)
    .y(function(d) { return d.y }, yScale)
    .attr("fill", function(d) { return d.val; }, colorScale)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2);

  var labelY = new Plottable.Components.AxisLabel('Time of day', -90);
  var labelX = new Plottable.Components.AxisLabel('Day of week', 0);
  
  var table = new Plottable.Components.Table([
    [labelY, yAxis, plot],
    [null, null, xAxis],
    [null, null, labelX]
  ]);

  // uncomment this to add a legend
  // var legend = new Plottable.Components.InterpolatedColorLegend(colorScale);
  // legend.xAlignment("center");
  // legend.yAlignment("center");
  // legend.orientation('right')

  // var table = new Plottable.Components.Table([
  //   [labelY, yAxis, plot, legend],
  //   [null, null, xAxis, null],
  //   [null, null, labelX, null]
  // ]);

  table.renderTo(selector);
};


function plotAreaChart(selector) {
  // data needs to be inside an array of objects
  // the x value should be the email volume
  // the y value should be the time bucket
  var data = [
    { x: "Midnight - 4am", y: 1},
    { x: "4am - 8am", y: 0},
    { x: "8am - Noon", y: 14},
    { x: "Noon - 4pm", y: 9},
    { x: "4pm - 8pm", y: 0},
    { x: "8pm - Midnight", y: 3}
  ];

  var hourBuckets = ["Midnight - 4am", "4am - 8am", "8am - Noon", "Noon - 4pm", "4pm - 8pm", "8pm - Midnight"];

  var xScale = new Plottable.Scales.Category();
  xScale.domain(hourBuckets);

  var yScale = new Plottable.Scales.Linear();
  var xAxis = new Plottable.Axes.Category(xScale, 'bottom');
  var yAxis = new Plottable.Axes.Numeric(yScale, 'left');

  // Setting the outer padding
  xScale.outerPadding(0);
  xScale.innerPadding(10000);

  var plot = new Plottable.Plots.Area()
    .addDataset(new Plottable.Dataset(data))
    .x(function(d) { return d.x; }, xScale)
    .y(function(d) { return d.y; }, yScale);

  // Setting the interpolator to make the lines smoother
  plot.interpolator("basis");

  var labelY = new Plottable.Components.AxisLabel('Email volume', -90);
  var labelX = new Plottable.Components.AxisLabel('Time of day', 0);

  var table = new Plottable.Components.Table([
    [labelY, yAxis, plot],
    [null, null, xAxis],
    [null, null, labelX]
  ]);

  table.renderTo(selector);
};


// Render charts
plotLineChart('svg#line-chart');
plotScatterChart('svg#scatterplot-chart');
plotDoubleBarChart('svg#double-bar-chart');
plotHeatmapChart('svg#heatmap-chart');
plotAreaChart('svg#area-chart');