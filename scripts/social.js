var margin_social = {top: 30, right: 30, bottom: 30, left: 0},
    width_social = 400 - margin_social.left - margin_social.right,
    height_social = 180 - margin_social.top - margin_social.bottom;

// append the svg object to the body of the page
var svg_social = d3.select("#social_impact")
  .append("svg")
    .attr("width", width_social + margin_social.left + margin_social.right)
    .attr("height", height_social + margin_social.top + margin_social.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_social.left + "," + margin_social.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/Ren0ki/AI_IMPACT/main/data/SOCIAL_IMPACT2.csv", function(data) {

  //GROUPED DATA
  var sumstat = d3.nest() 
    .key(function(d) { return d.CATEGORY;})
    .entries(data);

  //X AXIS
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.SCORE; }))
    .range([ 0, width_social ]);
  svg_social.append("g")
    .attr("transform", "translate(0," + height_social + ")")
    .call(d3.axisBottom(x).ticks(5));

  //Y AXIS
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.n; })])
    .range([ height_social, 0 ]);
  svg_social.append("g")
    .call(d3.axisLeft(y));

  // color palette
  var res = sumstat.map(function(d){ return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#538cf4','#ed6051','#f8c954'])

  // Draw the line
  svg_social.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.SCORE); })
            .y(function(d) { return y(+d.n); })
            (d.values)
        })

  // LEGEND
  var social_legend = svg_social.append("g")
    .attr("class", "social_legend")
    .attr("transform", "translate(" + (width_social - 130) + ",-20)");

  social_legend.selectAll("g")
    .data(res)
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