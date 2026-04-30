// set the dimensions and margin_demographics of the graph
var margin_demographic = {top: 270, right: 100, bottom: -60, left: -200},
    width_demographic = 600 - margin_demographic.left - margin_demographic.right,
    height_demographic = 300 - margin_demographic.top - margin_demographic.bottom;

// append the svg object to the body of the page
var svg_demographic = d3.select("#demographic")
  .append("svg")
    .attr("width", width_demographic + margin_demographic.left + margin_demographic.right)
    .attr("height", height_demographic + margin_demographic.top + margin_demographic.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_demographic.left + "," + margin_demographic.top + ")");

// Parse the Data
d3.csv("../data/DEMOGRAPHIC_CONSIDERATION.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.CATEGORY)}).keys()

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width_demographic])
      .padding([0.2])
  svg_demographic.append("g")
    .attr("transform", "translate(0," + height_demographic + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))
         .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 3000])
    .range([ height_demographic, 0 ]);
  // svg_demographic.append("g")
  //   .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#44a953','#ea4738','#3067d0', '#f8c954'])

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

  // ----------------
  // Create a tooltip
  // ----------------
  var tooltip = d3.select("#tooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip
        .html("subgroup: " + subgroupName + "<br>" + "COUNT: " + subgroupValue)
        .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.event.pageX + 10) + "px")
      .style("top", (d3.event.pageY - 20) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

  // Show the bars
  svg_demographic.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.CATEGORY); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
        .attr("stroke", "grey")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

        // LEGEND
  var demographic_legend = svg_demographic.append("g")
    .attr("transform", "translate(" + (width_demographic - 670) + ",-240)");

  demographic_legend.selectAll("g")
    .data(subgroups)
    .enter()
    .append("g")
      .attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; })
    .call(function(g) {
      g.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", function(d) { return color(d); });

      g.append("text")
        .attr("x", 18)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("font-family", "sans-serif")
        .text(function(d) { return d; });
    });


})