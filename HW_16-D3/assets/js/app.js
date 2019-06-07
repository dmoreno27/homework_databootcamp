// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart

// // Step 2: Create an SVG wrapper,
// // append an SVG group that will hold our chart,
// // and shift the latter by left and top margins.
// // =================================


d3.select(window).on("resize", handleResize);

// credit source: https://github.com/wbkd/d3-extended - This feature replicates a dynamic z-index capability to bring datapoints of interest to the foreground on mouseover.
d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function () {
  return this.each(function () {
    var firstChild = this.parentNode.firstChild;
    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
};
//end credit

loadChart();


function handleResize() {
  var svgArea = d3.select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
    loadChart();
  }
}

function loadChart() {
  var svgWidth = 960;
  var svgHeight = 600;

  var margin = {
    top: 30,
    right: 40,
    bottom: 100,
    left: 100
  };

  var chartWidth = svgWidth - margin.left - margin.right;
  var chartHeight = svgHeight - margin.top - margin.bottom;

  var svg = d3.select("#scatter").append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("../assets/data/data.csv").then(function (stateData) {
    var t = chartGroup.transition().duration(800).ease(d3.easeCubic);

    var stateData = stateData.sort(function (b, a) { return b.age - a.age });

    var x_val = 'Age: ';
    var y_val = 'Healthcare: ';
    var x_unit = '';
    var y_unit = '%';
    var x_data = stateData.map(stateDatum => +stateDatum.age);
    var y_data = stateData.map(stateDatum => +stateDatum.healthcare);
    var abbr = stateData.map(stateDatum => stateDatum.abbr);
    var state = stateData.map(stateDatum => stateDatum.state);

    var x_min = d3.min(x_data)  * 0.85;
    var x_max = d3.max(x_data) * 1.15;
    var y_min = d3.min(y_data) * 0.85;
    var y_max = d3.max(y_data) * 1.15;

    var xScale = d3.scaleLinear()
      .domain([x_min, x_max])
      .range([0, chartWidth])
      ;

    var yScale = d3.scaleLinear()
      .domain([y_min, y_max])
      .range([chartHeight, 0])
      ;

    var yAxis = d3.axisLeft(yScale).ticks(10);
    var xAxis = d3.axisBottom(xScale).ticks(10);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .attr('id', "x_axis_line")
      .call(xAxis)
      ;

    chartGroup.append("g")
      .attr('id', "y_axis_line")
      .call(yAxis)
      ;


    var div = d3.select("body").append("div")
      .attr("class", "d3-tip")
      .style("opacity", 0);

    chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("class", "stateCircle")
      .attr("cx", (d, i) => xScale(x_data[i]))
      .attr("cy", (d, i) => yScale(y_data[i]))
      .attr("r", 15)
      .attr("width", (d, i) => chartWidth - xScale(x_data[i]))
      .attr("height", (d, i) => chartHeight - yScale(y_data[i]))
      .on('mouseover', function (d, i) {
        d3.select(this).transition(t) ;
        div.transition(t)
          .duration(50)
          .style("opacity", 1);
        div.html(state[i] + "<br/>"
          + x_val + x_data[i] + x_unit + "<br/>"
          + y_val + y_data[i] + y_unit)
          .style("left", (d3.event.pageX + 20) + "px")
          .style("top", (d3.event.pageY - 20) + "px");
      })
      .on('mouseout', function (d, i) {
        d3.select(this).transition(t)
          .attr('opacity', '1');
        div.transition(t).style("opacity", 0);
      });



    chartGroup.selectAll("stateCircle")
      .data(stateData)
      .enter()
      .append("text")
      .attr("class", "stateText")
      .attr("x", (d, i) => xScale(x_data[i]))
      .attr("y", (d, i) => yScale(y_data[i]))
      .text((d, i) => abbr[i])
      .attr("dy", ".35em")

      ;

    var yAxis_var = [["Lacks Healthcare (%)", stateData.map(stateDatum => +stateDatum.healthcare), 0, "Healthcare: ", "%"],
    ["Smokes (%)", stateData.map(stateDatum => +stateDatum.smokes), 1, "Smokes: ", "%"],
    ["Obesity (%)", stateData.map(stateDatum => +stateDatum.obesity), 2, "Obesity: ", "%"]];

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (chartHeight / 2))
      .attr("y", 0 - margin.left)
      .attr("dy", "1em")
      .attr("id", "y_axis_1")
      .attr("class", "active")
      .text(yAxis_var[0][0])
      ;
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("id", "y_axis_2")
      .attr("class", "inactive")
      .text(yAxis_var[1][0])
      ;
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("id", "y_axis_3")
      .attr("class", "inactive")
      .text(yAxis_var[2][0])
      ;

    var xAxis_var = [["Age (Median)", stateData.map(stateDatum => +stateDatum.age), 0]
      , ["In Poverty (%)", stateData.map(stateDatum => +stateDatum.poverty), 1,]
      , ["Household Income (Median)", stateData.map(stateDatum => +stateDatum.income), 2]];

    chartGroup.append("text")
      .attr("transform",
        "translate(" + (chartWidth / 2) + " ," +
        (chartHeight + margin.top) + ")")
      .attr("dy", "1em")
      .attr("id", "x_axis_1")
      .attr("class", "active")
      .text(xAxis_var[0][0])
      ;
    chartGroup.append("text")
      .attr("transform",
        "translate(" + (chartWidth / 2) + " ," +
        (chartHeight + margin.top + 20) + ")")
      .attr("dy", "1em")
      .attr("id", "x_axis_2")
      .attr("class", "inactive")
      .text(xAxis_var[1][0])
      ;
    chartGroup.append("text")
      .attr("transform",
        "translate(" + (chartWidth / 2) + " ," +
        (chartHeight + margin.top + 40) + ")")
      .attr("dy", "1em")
      .attr("id", "x_axis_3")
      .attr("class", "inactive")
      .text(xAxis_var[2][0])
      ;

    function updatex_axis() {
      x_min = d3.min(x_data)*0.85;
      x_max = d3.max(x_data)*1.15;


      var xScale = d3.scaleLinear()
        .domain([x_min, x_max])
        .range([0, chartWidth])
        ;

      var xAxis = d3.axisBottom(xScale).ticks(10);
      chartGroup.select("#x_axis_line").transition(t).call(xAxis);
      chartGroup.selectAll("circle").data(x_data)
      .on('mouseover', function (d, i) {
        d3.select(this).transition(t) ;
        div.transition(t)
          .duration(50)
          .style("opacity", 1);
        div.html(state[i] + "<br/>"
          + x_val + x_data[i] + x_unit + "<br/>"
          + y_val + y_data[i] + y_unit)
          .style("left", (d3.event.pageX + 20) + "px")
          .style("top", (d3.event.pageY - 20) + "px");
      })
      .on('mouseout', function (d, i) {
        d3.select(this).transition(t)
          .attr('opacity', '1');
        div.transition(t).style("opacity", 0);
      })


chartGroup.selectAll(".stateCircle").transition(t)
.attr("cx", (d, i) => xScale(x_data[i]));

chartGroup.selectAll(".stateText").transition(t)
.attr("x", (d, i) => xScale(x_data[i]));

    }
    function updatey_axis() {
      y_min = d3.min(y_data)*0.85;
      y_max = d3.max(y_data)*1.15;

      var yScale = d3.scaleLinear()
        .domain([y_min, y_max])
        .range([chartHeight, 0])
        ;

      var yAxis = d3.axisLeft(yScale).ticks(10);
      chartGroup.select("#y_axis_line").transition(t).call(yAxis);
      chartGroup.selectAll("circle").data(y_data)
      .on('mouseover', function (d, i) {
        d3.select(this).transition(t) ;
        div.transition(t)
          .duration(50)
          .style("opacity", 1);
        div.html(state[i] + "<br/>"
          + x_val + x_data[i] + x_unit + "<br/>"
          + y_val + y_data[i] + y_unit)
          .style("left", (d3.event.pageX + 20) + "px")
          .style("top", (d3.event.pageY - 20) + "px");
      })
      .on('mouseout', function (d, i) {
        d3.select(this).transition(t).attr('opacity', '1');
        div.transition(t).style("opacity", 0);
      })


      
chartGroup.selectAll(".stateCircle").transition(t)
        .attr("cy", (d, i) => yScale(y_data[i]));

      chartGroup.selectAll(".stateText").transition(t)
        .attr("y", (d, i) => yScale(y_data[i]));

    }

    chartGroup.selectAll("#x_axis_1, #x_axis_2, #x_axis_3").on("click", function updateClass() {
      d3.selectAll("#x_axis_1, #x_axis_2, #x_axis_3").attr("class", "inactive");
      d3.select(this).attr("class", "active");

      var selected_axis = d3.select(this).attr("id");

      switch (selected_axis) {
        case 'x_axis_1':
          x_data = stateData.map(stateDatum => +stateDatum.age);
          x_val = "Age: ";
          x_unit = "";
          updatex_axis();

          ;

          break;
        case 'x_axis_2':
          x_data = stateData.map(stateDatum => +stateDatum.poverty);
          x_val = "Poverty: ";
          x_unit = "";
          updatex_axis();

          ;
          break;
        case 'x_axis_3':
          x_data = stateData.map(stateDatum => +stateDatum.income);
          x_val = "Income: ";
          x_unit = "(median)";
          updatex_axis();


      }


    })




    chartGroup.selectAll("#y_axis_1, #y_axis_2, #y_axis_3").on("click", function updateClass() {
      d3.selectAll("#y_axis_1, #y_axis_2, #y_axis_3").attr("class", "inactive");
      d3.select(this).attr("class", "active");

      var selected_axis = d3.select(this).attr("id");

      switch (selected_axis) {
        case 'y_axis_1':
          y_data = stateData.map(stateDatum => +stateDatum.healthcare);
          y_val = "Healthcare: ";
          y_unit = "%";
          updatey_axis();

          ;

          break;
        case 'y_axis_2':
          y_data = stateData.map(stateDatum => +stateDatum.smokes);
          y_val = "Smokes: ";
          y_unit = "%";
          updatey_axis();

          ;
          break;
        case 'y_axis_3':
          y_data = stateData.map(stateDatum => +stateDatum.obesity);
          y_val = "Obesity: ";
          y_unit = "%";
          updatey_axis();

          ;
          break;
        default:
          console.log('No y_axis selected');

      }


    })



  })

    ;
}



