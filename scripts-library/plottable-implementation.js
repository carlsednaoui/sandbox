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
  
  // var table = new Plottable.Components.Table([
  //   [labelY, yAxis, plot],
  //   [null, null, xAxis],
  //   [null, null, labelX]
  // ]);

  // uncomment this to add a legend
  var legend = new Plottable.Components.InterpolatedColorLegend(colorScale);
  legend.xAlignment("center");
  legend.yAlignment("center");
  legend.orientation('right')

  var table = new Plottable.Components.Table([
    [labelY, yAxis, plot, legend],
    [null, null, xAxis, null],
    [null, null, labelX, null]
  ]);

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
  // plot.interpolator("basis");

  var labelY = new Plottable.Components.AxisLabel('Email volume', -90);
  var labelX = new Plottable.Components.AxisLabel('Time of day', 0);

  var sPlot = new Plottable.Plots.Scatter()
     .addDataset(new Plottable.Dataset(data))
     .x(function(d) { return d.x; }, xScale)
     .y(function(d) { return d.y; }, yScale);

  var group = new Plottable.Components.Group([plot, sPlot]);

  var table = new Plottable.Components.Table([
    [labelY, yAxis, group],
    [null, null, xAxis],
    [null, null, labelX]
  ]);

  table.renderTo(selector);
  data.forEach(function(dataPoint, index) {
    var label = sPlot.foreground().append("text");
    var anchor = 'middle'; 
    var offset = 0;
    if (index === 0) { 
      anchor = 'right';
      offset = 1;
    }
    else if (index === data.length - 1) {
      offset = -1;
      anchor = 'left';
    }
    label.attr({
      "text-anchor": anchor,
      "font-family": "monospace",
      "dx": offset + "em", //use if you want to offset x
      "dy": "-1em", //offset y relative to text-anchor,
      "x": xScale.scale(dataPoint.x),
      "y": yScale.scale(dataPoint.y)
    });
    label.text(dataPoint.y);
  });
};

function plotPieChart(selector) {
  // data needs to be in an array
  // percentages need to be rounded off to the nearest full digit (no decimals)

  var data = [
    { "day": "Monday",
      "total": 10,
      "percent": 11,
      "color": "#1DCE6D"
    },
    { "day": "Tuesday",
      "total": 4,
      "percent": 7,
      "color": "#2C83D1"
    },
    { "day": "Wednesday",
      "total": 6,
      "percent": 7,
      "color": "#00D3C5"
    },
    { "day": "Thursday",
      "total": 1,
      "percent": 19,
      "color": "#A864C1"
    },
    { "day": "Friday",
      "total": 0,
      "percent": 19,
      "color": "#D19675"
    },
    { "day": "Saturday",
      "total": 4,
      "percent": 15,
      "color": "#EA492B"
    },
    { "day": "Sunday",
      "total": 5,
      "percent": 19,
      "color": "#EF923C"
    }
  ];

  var scale = new Plottable.Scales.Linear();
  var plot = new Plottable.Plots.Pie()
    .addDataset(new Plottable.Dataset(data))
    .sectorValue(function(d) { return d.percent; }, scale)
    .attr("fill", function(d) { return d.color; })
    .innerRadius(80)
    .labelFormatter(function(d) { return d + '%'; })
    .labelsEnabled(true);

  // legend
  colors = ["#1DCE6D", "#2C83D1", "#00D3C5", "#A864C1", "#D19675", "#EA492B", "#EF923C"];
  var colorScale = new Plottable.Scales.Color().range(colors);
  var legend = new Plottable.Components.Legend(colorScale);
  colorScale.domain(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
  legend.xAlignment("center");
  legend.yAlignment("center");

  var squareFactory = Plottable.SymbolFactories.square();
  legend.symbol(function(d) { return squareFactory; });

  var table = new Plottable.Components.Table([
    [plot, legend]
  ]);

  table.renderTo(selector);
};

function plotEmailVolumeOverTime(selector) {
  var data = [
    { x: "July 1", y: 10},
    { x: "July 15", y: 13},
    { x: "August 1", y: 10},
    { x: "August 15", y: 9}
  ];

  var hourBuckets = ["July 1", "July 15", "August 1", "August 15"];

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
  // plot.interpolator("basis");

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
plotPieChart('svg#pie-chart');
plotEmailVolumeOverTime("svg#email-volume-over-time-chart");
