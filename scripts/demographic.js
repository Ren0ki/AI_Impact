var margin_demographic = {top: 50, right: 300, bottom: 130, left: 0},
    width_demographic = 700 - margin_demographic.left - margin_demographic.right,
    height_demographic = 450 - margin_demographic.top - margin_demographic.bottom;

var svg_demographic = d3.select("#demographic")
  .append("svg")
    .attr("width", width_demographic + margin_demographic.left + margin_demographic.right)
    .attr("height", height_demographic + margin_demographic.top + margin_demographic.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_demographic.left + "," + margin_demographic.top + ")");
          
// Parse the Data
d3.csv("data/DEMOGRAPHIC_CONSIDERATION.csv", function(data) {

 var subgroups = data.columns.slice(1)
 var groups = d3.map(data, function(d){return(d.CATEGORY)}).keys()

//X AXIS
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

    //Y AXIS
  var y = d3.scaleLinear()
    .domain([0, 12000])
    .range([ height_demographic, 0 ]);
  svg_demographic.append("g")
    .call(d3.axisLeft(y));
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#44a953','#ea4738','#3067d0', '#f8c954'])

    var stackedData = d3.stack()
    .keys(subgroups)
    (data)
    
      svg_demographic.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.CATEGORY); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())

    var demographic_legend = svg_demographic.append("g")
    .attr("class", "demographic_legend")
    .attr("transform", "translate(" + (-150) + ",10)");

  demographic_legend.selectAll("g")
    .data(subgroups)
    .enter()
    .append("g")
      .attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; })
    .call(function(g) {
      g.append("rect")
        .attr("x", 0)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", function(d) { return color(d); });

      g.append("text")
        .attr("x", 18)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("font-family", "sans-serif")
        .attr("fill", "#333")
        .text(function(d) { return d; });
    });

})