var margin_demographic = {top: 10, right: 30, bottom: 20, left: 50},
    width_demographic = 560 - margin_demographic.left - margin_demographic.right,
    height_demographic = 200 - margin_demographic.top - margin_demographic.bottom;

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
 var groups = d3.map(data, function(d){return(d.SCORE)}).keys()

//X AXIS
 var x = d3.scaleBand()
      .domain(groups)
      .range([0, width_demographic])
      .padding([0.2])
  svg_demographic.append("g")
    .attr("transform", "translate(0," + height_demographic + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

    //Y AXIS
  var y = d3.scaleLinear()
    .domain([0, 25000])
    .range([ height_demographic, 0 ]);
  svg_demographic.append("g")
    .call(d3.axisLeft(y));
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

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
        .attr("x", function(d) { return x(d.data.SCORE); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
})