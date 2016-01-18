
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

function lineChartMultiLine(selector) {
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
    .y(function(d) {
      // ensure line chart doesn't drop below 0 due to interpolation
      if (d.emails == 0) return y(d.emails) - 4;
      return y(d.emails);
    })
    .interpolate("monotone") // smooth that line, bro
  ;

  var color = d3.scale.ordinal()
    .range(["#A767BF", "#D09678"]);

  var chart = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  d3.json("/d3/data/line-chart-multi-line.json", function(error, json) {
    var data = json.data;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    var companies = color.domain().map(function(company) {
      return {
        company: company,
        values: data.map(function(d) {
          return {
            emails: d[company],
            date: d.date
          };
        })
      };
    });

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(companies, function(c) { return d3.max(c.values, function(e) { return e.emails; }); })]);

    var company = chart.selectAll(".company")
      .data(companies)
      .enter().append("g")
      .attr("class", "company")
    ;

    company.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.company); })
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

    company.append("g")
      .selectAll("text")
      .data( function(d) { return d.values; })
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

   // create legend
    var legend = chart.selectAll(".legend")
      .data(companies.slice())
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
        .style("fill", function(d) {return color(d.company); });

      legend.append("text")
        .attr("x", width + 40)
        .attr("y", 8)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) {
         // if a company has a long name
         // trim it and add ellipsis after 15 characters
          if (d.company.length > 15) {
            return d.company.slice(0, 15) + "...";
          } else {
            return d.company;
          }
        });

  });
}
lineChartMultiLine(".line-chart-multi-line");


function areaChartSimple(selector) {
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

  var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.emails); })
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
      .attr("class", "area")
      .attr("d", area)
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
areaChartSimple(".area-chart-simple");


function areaChartMultiLine(selector) {
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
    .tickFormat(function(d) { return d *100 + "%"; })
  ;

  var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) {
      // ensure line chart doesn't drop below 0 due to interpolation
      if (d.emails == 0) return y(d.emails) - 6;
      return y(d.emails);
    })
    .interpolate("monotone") // smooth that line, bro
  ;

  var color = d3.scale.ordinal()
    .range(["#A767BF", "#D09678"]);

  var chart = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  d3.json("/d3/data/line-chart-multi-line-time-of-send.json", function(error, json) {

    var data = json.data;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    var companies = color.domain().map(function(company) {
      return {
        company: company,
        values: data.map(function(d) {
          return {
            emails: d[company],
            date: d.date
          };
        })
      };
    });

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(companies, function(c) { return d3.max(c.values, function(e) { return e.emails; }); })]);

    var company = chart.selectAll(".company")
      .data(companies)
      .enter().append("g")
      .attr("class", "company")
    ;

    company.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return area(d.values); })
      .style("stroke", function(d) { return color(d.company); })
      .style("fill", function(d) { return color(d.company); })
      .style("stroke", function(d) { return color(d.company); })
      .style("fill-opacity", 0.5)
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

    company.append("g")
      .selectAll("text")
      .data( function(d) { return d.values; })
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
        // move all items above the line
        return -10;
      })
      .text(function(d, i) {
        return d.emails * 100 + "%";
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
       .text("Email volume")
   ;

   // add bottom label
   chart.append("g")
     .attr("class", "label")
     .append("text")
       .attr("text-anchor", "middle")
       .attr("y", (height + margin.top + margin.bottom) - 50) 
       .attr("x", width / 2)
       .text("Time of day")
   ;

   // create legend
    var legend = chart.selectAll(".legend")
      .data(companies.slice())
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
        .style("fill", function(d) {return color(d.company); });

      legend.append("text")
        .attr("x", width + 40)
        .attr("y", 8)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) {
         // if a company has a long name
         // trim it and add ellipsis after 15 characters
          if (d.company.length > 15) {
            return d.company.slice(0, 15) + "...";
          } else {
            return d.company;
          }
        });

  });
}
areaChartMultiLine(".area-chart-multi-line");


function areaChartStacked(selector) {
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

  var stack = d3.layout.stack()
    .offset("zero")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.emails; })
  ;

  var nest = d3.nest()
    .key(function(d) { return d.name; })
  ;

  var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) {
      // ensure line chart doesn't drop below 0 due to interpolation
      if (d.emails == 0) return y(d.y0 + d.y) - 3;
      return y(d.y0 + d.y);
    })
  ;

  var color = d3.scale.ordinal()
    .range(["#A767BF", "#D09678"]);

  var chart = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  d3.json("/d3/data/line-chart-stacked-area.json", function(error, json) {
    var data = json.data;

    var companies = d3.map(data, function(d) { return d.name; }).values().map(function(d) {return d.name; });

    color.domain(companies);

    var layers = stack(nest.entries(data));
    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

    chart.selectAll(".layer")
      .data(layers)
      .enter()
      .append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d, i) { return color(i); })
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
        return y(d.y0 + d.y);
      })
      .attr("x", function(d, i) {
        return x(d.date);
      })
      .attr("dx", function(d, i) {
        if (x(d.date) == 0) return 10; // if it's the first data point, get it away form the y-axis
      })
      .attr("dy", function(d, i) {
        // move all labels above the line
        return -7;
      })
      .text(function(d, i) {
        // don't return a 0 value label
        if (d.emails === 0 ) return;
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
   // create legend
    var legend = chart.selectAll(".legend")
      .data(companies.slice())
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
        .style("fill", function(d) {return color(d); });

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
areaChartStacked(".area-chart-stacked");


function areaChartStackedNormalized(selector) {
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
    .tickFormat(d3.format(".0%"))
  ;

  var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) {
      // ensure line chart doesn't drop below 0 due to interpolation
      if (d.y == 0) return y(d.y0 + d.y) - 1;
      return y(d.y0 + d.y);
    })
    .interpolate("monotone") // smooth that line, bro
  ;

  var stack = d3.layout.stack()
    .values(function(d) { return d.values; })
  ;

  var color = d3.scale.ordinal()
    .range(["#A767BF", "#D09678"]);

  var chart = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  d3.json("/d3/data/line-chart-multi-line.json", function(error, json) {
    var data = json.data;

    var companyNames = d3.keys(data[0]).filter(function(key) { return key !== "date"; });
    color.domain(companyNames);

    var companies = stack(color.domain().map(function(company) {
      return {
        company: company,
        values: data.map(function(d) {
        // debugger;
          return {
            date: d.date,
            y: d[company] / d3.sum(companyNames.map(function(c) {return d[c]; })),
            value: d[company]
          };
        })
      };
    }));

    x.domain(data.map(function(d) { return d.date; }));

    var company = chart.selectAll(".company")
      .data(companies)
      .enter()
      .append("g")
      .attr("class", "company")
    ;

    company.append("path")
      .attr("class", "area")
      .attr("d", function(d) { return area(d.values); })
      .style("stroke", function(d) { return color(d.company); })
      .style("fill", function(d) { return color(d.company); })
      .style("stroke", function(d) { return color(d.company); })
      .style("fill-opacity", 0.5)
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

    company.append("g")
      .selectAll("text")
      .data( function(d) { return d.values; })
      .enter()
      .append("text")
      .classed("data-label", true)
      .attr("y", function(d, i) {
        return y(d.y0 + d.y);
      })
      .attr("x", function(d, i) {
        return x(d.date);
      })
      .attr("dx", function(d, i) {
        if (i == 0) return 10; // if it's the first data point, get it away form the y-axis
      })
      .attr("dy", function(d, i) {
        // move all labels below the line
        return +15;
      })
      .text(function(d, i) {
        // don't return a 0 value label
        if (d.value === 0 ) return;
        return d.value;
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

   // create legend
    var legend = chart.selectAll(".legend")
      .data(companies.slice())
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
        .style("fill", function(d) {return color(d.company); });

      legend.append("text")
        .attr("x", width + 40)
        .attr("y", 8)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) {
         // if a company has a long name
         // trim it and add ellipsis after 15 characters
          if (d.company.length > 15) {
            return d.company.slice(0, 15) + "...";
          } else {
            return d.company;
          }
        });

  });
}
areaChartStackedNormalized(".area-chart-stacked-normalized");