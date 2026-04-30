
var margin_future = {top: -30, right: 60, bottom: 30, left: 0},
    width_future = 400 - margin_future.left - margin_future.right,
    height_future = 120 - margin_future.top - margin_future.bottom;

    var svg_future = d3.select("#future_impact")
  .append("svg")
    .attr("width", width_future + margin_future.left + margin_future.right)
    .attr("height", height_future + margin_future.top + margin_future.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_future.left + "," + margin_future.top + ")");

  d3.csv("https://raw.githubusercontent.com/Ren0ki/AI_IMPACT/main/data/FUTURE_IMPACT.csv", function(data) {      
    
    var sumstat = d3.nest() 
    .key(function(d) { return d.CATEGORY;})
    .rollup(function(d) {
      q1 = d3.quantile(d.map(function(g) { return g.SCORE;}).sort(d3.ascending),.25)
      median = d3.quantile(d.map(function(g) { return g.SCORE;}).sort(d3.ascending),.5)
      q3 = d3.quantile(d.map(function(g) { return g.SCORE;}).sort(d3.ascending),.75)
      interQuantileRange = q3 - q1
      min = q1 - 1.5 * interQuantileRange
      max = q3 + 1.5 * interQuantileRange
      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    })
    .entries(data) 

    //X AXIS
    var x = d3.scaleBand()
    .range([ 0, width_future ])
    .domain(["MEDICAL", "EDUCATION", "ELECTIONS", "ECONOMY", "CRIMINAL JUSTICE", "ARTS ENTERTAINMENT", "RELATIONSHIPS", "JOBS", "ENVIRONMENT", "NEWS"])
    .paddingInner(1)
    .paddingOuter(.5)
  svg_future.append("g")
    .attr("transform", "translate(0," + height_future + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");


    //Y AXIS
     var y = d3.scaleLinear()
    .domain([0,7])
    .range([height_future, 0])
  svg_future.append("g").call(d3.axisLeft(y))

  // rectangle for the main box
  var boxWidth = 20
  svg_future
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.q3))})
        .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#f8c954")

  // Show the median
  svg_future
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
      .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
      .attr("y1", function(d){return(y(d.value.median))})
      .attr("y2", function(d){return(y(d.value.median))})
      .attr("stroke", "black")
      .style("width", 80)

})