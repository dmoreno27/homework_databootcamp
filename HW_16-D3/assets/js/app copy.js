// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart

// // Step 2: Create an SVG wrapper,
// // append an SVG group that will hold our chart,
// // and shift the latter by left and top margins.
// // =================================
// console.log(stateData.map(stateDatum=>stateDatum.age));



d3.select(window).on("resize", handleResize);

// credit source: https://github.com/wbkd/d3-extended - This feature replicates a dynamic z-index capability to bring datapoints of interest to the foreground on mouseover.
d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function() {  
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    });
};
//end credit
// When the browser loads, loadChart() is called
loadChart();

function handleResize() {
  var svgArea = d3.select("svg");

  // If there is already an svg container on the page, remove it and reload the chart
  if (!svgArea.empty()) {
    svgArea.remove();
    loadChart();
  }
}
function activeLink(){d3.select(this).attr("class","active")}
function inactiveLink(){d3.select(this).attr("class","inactive")}
function loadChart() {
  var svgWidth = 960;
  var svgHeight = 500;

  var margin = {
    top: 30,
    right: 40,
    bottom: 0,
    left: 100
  };

  var chartWidth = svgWidth - margin.left - margin.right;
  var chartHeight = svgHeight - margin.top - margin.bottom;

  var svg = d3.select("#scatter").append("svg")
    .attr("height", svgHeight + 100)
    .attr("width", svgWidth + 100);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);







  d3.csv("../assets/data/data.csv").then(function (stateData) {

    var stateData = stateData.sort(function (b, a) { return b.age - a.age });

    stateData.forEach(function (data) {
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.poverty = +data.poverty;
      data.povertyMoe = +data.povertyMoe;
      data.ageMoe = +data.ageMoe;
      data.income = +data.income;
      data.incomeMoe = +data.incomeMoe;
      data.healthcareLow = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity = +data.obesity;
      data.obesityLow = +data.obesityLow;
      data.obesityHigh = +data.obesityHigh;
      data.smokes = +data.smokes;
      data.smokesLow = +data.smokesLow;
      data.smokesHigh = +data.smokesHigh;

    });



    
    var age = stateData.map(d => d.age);

    var xScale_age = d3.scaleLinear()
      .domain([d3.min(age.sort(function (b, a) { return b - a })) - 2, 2 + d3.max(age.sort(function (b, a) { return b - a }))])
      .range([0, chartWidth])
      ;
      var poverty = stateData.map(d => d.poverty);

      var xScale_poverty = d3.scaleLinear()
        .domain([d3.min(poverty.sort(function (b, a) { return b - a })) - 2, 2 + d3.max(poverty.sort(function (b, a) { return b - a }))])
        .range([0, chartWidth])
        ;
        var income = stateData.map(d => d.income);

    var xScale_income = d3.scaleLinear()
      .domain([d3.min(income.sort(function (b, a) { return b - a })) - 2, 2 + d3.max(income.sort(function (b, a) { return b - a }))])
      .range([0, chartWidth])
      ;


    var healthcare = stateData.map(d => d.healthcare);

    var yScale_healthcare = d3.scaleLinear()
      .domain([d3.min(healthcare.sort(function (b, a) { return b - a })) - 2, 2 + d3.max(healthcare.sort(function (b, a) { return b - a }))])
      .range([chartHeight, 0])
      ;
      var obesity = stateData.map(d => d.obesity);

      var yScale_obesity = d3.scaleLinear()
        .domain([d3.min(obesity.sort(function (b, a) { return b - a })) - 2, 2 + d3.max(obesity.sort(function (b, a) { return b - a }))])
        .range([chartHeight, 0])
        ;
        var smokes = stateData.map(d => d.smokes);

        var yScale_smokes = d3.scaleLinear()
          .domain([d3.min(smokes.sort(function (b, a) { return b - a })) - 2, 2 + d3.max(smokes.sort(function (b, a) { return b - a }))])
          .range([chartHeight, 0])
          ;


    var yAxis = d3.axisLeft(yScale_healthcare).ticks(10);
    var xAxis = d3.axisBottom(xScale_age).ticks(10);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis)
      ;

    chartGroup.append("g")
      .call(yAxis)
      ;

 chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("class", "stateCircle")
      .attr("cx", (d, i) => xScale_age(age[i]))
      .attr("cy", d => yScale_healthcare(d.healthcare))
      .attr("r", 15)
      .attr("width", d => chartWidth - xScale_age(d.age))
      .attr("height", d => chartHeight - yScale_healthcare(d.healthcare))
      ;

//  chartGroup.selectAll("stateCircle")
//       .data(stateData)
//       .enter()
//       .append("text")
//       .attr("class", "stateText")
//       .attr("y", d => yScale_healthcare(d.healthcare))
//       .attr("x", d => xScale_age(d.age))
//       .text(d => d.abbr)
//       .attr("dy", ".35em")
//       ;
    

// SET UP Y AXIS

  var yAxis_var = "Lacks Healthcare (%)";
  var yAxis_var_1 = "Smokes (%)";
  var yAxis_var_2 = "Obese (%)";


  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("id","y_axis_1")
    .attr("class", "active")
    .text(yAxis_var) 
    ;
    

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("id","y_axis_2")
    .attr("class", "inactive")
    .text(yAxis_var_1)
 
;

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+40 )
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("id","y_axis_3")
    .attr("class", "inactive")
    .text(yAxis_var_2)
;

  // });
  chartGroup.select("#y_axis_1").on("click", function(){
    chartGroup.selectAll("circle").attr("cy", d => yScale_healthcare(d.healthcare));

    var active   = y_axis_1.active ? false : true 
    ;
    d3.select("#y_axis_1").attr("class", "active");
    d3.select("#y_axis_2").attr("class", "inactive");
    d3.select("#y_axis_3").attr("class", "inactive");
    y_axis_1.active = active;
    var yAxis = d3.axisLeft(yScale_healthcare).ticks(10);


    chartGroup.append("g")
      .call(yAxis)
      ;
  
    chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("class", "stateCircle")
      .attr("cy", d => yScale_healthcare(d.healthcare))
      .attr("height", d => chartHeight - yScale_healthcare(d.healthcare))
      .transition(t)
      ;

  
    
  })

  chartGroup.select("#y_axis_2").on("click", function(){
    chartGroup.selectAll("circle").attr("cy", d => yScale_smokes(d.smokes));

    var active = y_axis_2.active ? false : true;
    d3.select("#y_axis_2").attr("class", "active");
    d3.select("#y_axis_1").attr("class", "inactive");
    d3.select("#y_axis_3").attr("class", "inactive");
    y_axis_2.active = active;
    var yAxis = d3.axisLeft(yScale_smokes).ticks(10);


    chartGroup.append("g")
      .call(yAxis)
      ;

  
      chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("class", "stateCircle")
      .attr("cy", d => yScale_smokes(d.smokes))
      .attr("height", d => chartHeight - yScale_smokes(d.smokes))
      .transition(t)

      ;
   
  })

  
  chartGroup.select("#y_axis_3").on("click", function(){
    chartGroup.selectAll("circle").attr("cy", d => yScale_obesity(d.obesity));

    var active = y_axis_3.active ? false : true;
    d3.select("#y_axis_2").attr("class", "inactive");
    d3.select("#y_axis_1").attr("class", "inactive");
    d3.select("#y_axis_3").attr("class", "active");
    y_axis_3.active = active;
    var yAxis = d3.axisLeft(yScale_obesity).ticks(10);


    chartGroup.append("g")
      .call(yAxis)
      ;

  
      chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("class", "stateCircle")
      .attr("cy", d => yScale_obesity(d.obesity))
      .attr("height", d => chartHeight - yScale_obesity(d.obesity))
      .transition(t)

      ;
   
  })

  //SETTING UP X AXES

  var xAxis_var = "Age (Median)";
  var xAxis_var_1 = "In Poverty (%)";
  var xAxis_var_2 = "Household Income (Median)";


  chartGroup.append("text")
  .attr("transform",
      "translate(" + (chartWidth / 2) + " ," +
      (chartHeight + margin.top) + ")")
    .attr("dy", "1em")
    .attr("id","x_axis_1")
    .attr("class", "inactive")
    .text(xAxis_var)   
    
    ;
    

    chartGroup.append("text")
    .attr("transform",
      "translate(" + (chartWidth / 2) + " ," +
      (chartHeight + margin.top) + ")")
    .attr("dy", "2em")
    .attr("id","x_axis_2")
    .attr("class", "inactive")
    .text(xAxis_var_1)
 
;

    chartGroup.append("text")
    .attr("transform",
      "translate(" + (chartWidth / 2) + " ," +
      (chartHeight + margin.top) + ")")
    .attr("dy", "3em")
    .attr("id","x_axis_3")
    .attr("class", "inactive")
    .text(xAxis_var_2)

;
  // });
  chartGroup.select("#x_axis_1").on("click", function(){
    chartGroup.selectAll("circle").attr("cx", d => xScale_age(d.age));

    var active   = x_axis_1.active ? false : true 
    ;
    d3.select("#x_axis_1").attr("class", "active");
    d3.select("#x_axis_2").attr("class", "inactive");
    d3.select("#x_axis_3").attr("class", "inactive");
    x_axis_1.active = active;



    var xAxis = d3.axisBottom(xScale_age).ticks(10);


    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis)
    ;
     
      chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("class", "stateCircle")
      .attr("cx", (d, i) => xScale_age(age[i]))
      .attr("width", d => chartWidth - xScale_age(d.age))
      .transition(t)

      ;
  })

  chartGroup.select("#x_axis_2").on("click", function(){
    chartGroup.selectAll("circle").attr("cx", d => xScale_poverty(d.poverty));

    var active = x_axis_2.active ? false : true;
    d3.select("#x_axis_2").attr("class", "active");
    d3.select("#x_axis_1").attr("class", "inactive");
    d3.select("#x_axis_3").attr("class", "inactive");
    x_axis_2.active = active;
 
    var xAxis = d3.axisBottom(xScale_poverty).ticks(10);


    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis)
    ;
    chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", (d, i) => xScale_poverty(poverty[i]))
    .attr("width", d => chartWidth - xScale_poverty(d.poverty))
    .transition(t)

    ;
  })

  chartGroup.select("#x_axis_3").on("click", function(){
    chartGroup.selectAll("circle").attr("cx", d => xScale_income(d.income));
    
    var active = x_axis_3.active ? false : true;
    d3.select("#x_axis_3").attr("class", "active");
    d3.select("#x_axis_1").attr("class", "inactive");
    d3.select("#x_axis_2").attr("class", "inactive");
    x_axis_3.active = active;
  
    var xAxis = d3.axisBottom(xScale_income).ticks(10);


    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis)
    ;
    chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", (d, i) => xScale_income(income[i]))
    .attr("width", d => chartWidth - xScale_income(d.income))
    .transition(t)

    ;
  })
  //END OF AXIS SET UP
    
  })

    ;

 
}



// On click, things that need to change
// class => active vs inactive
// yAxis_var vs xAxis_var label