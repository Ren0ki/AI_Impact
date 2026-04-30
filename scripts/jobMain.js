
var margin_job_main = {top: 60, right: 50, bottom: -40, left: -100},
    width_job_main = 500 - margin_job_main.left - margin_job_main.right,
    height_job_main = 600 - margin_job_main.top - margin_job_main.bottom;

  var svg_job_main = d3.select("#job_main_capability")
  .append("svg")
    .attr("width", width_job_main + margin_job_main.left + margin_job_main.right)
    .attr("height", height_job_main + margin_job_main.top + margin_job_main.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_job_main.left + "," + margin_job_main.top + ")");

    d3.csv("https://raw.githubusercontent.com/Ren0ki/AI_IMPACT/main/data/JOB_CAPABILITY.csv", function(data) {

  var keys = data.columns.slice(1)

  //X AXIS
   var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.SCORE; }))
    .range([ 0, width_job_main ]);
  svg_job_main.append("g")
    .attr("transform", "translate(0," + height_job_main + ")")
    .call(d3.axisBottom(x).ticks(2));

    //Y AXIS
     var y = d3.scaleLinear()
    .domain([0, 20000])
    .range([ height_job_main, 0 ]);
  svg_job_main.append("g")
    .call(d3.axisLeft(y));

     var color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#538cf4','#f8c954','#ff7f00','#3067d0', '#d34e21','#44a953','#68bbc3','#8f1f15'])

    var stackedData = d3.stack()
    .keys(keys)
    (data)

   svg_job_main
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .style("fill", function(d) { console.log(d.key) ; return color(d.key); })
      .attr("d", d3.area()
        .x(function(d, i) { return x(d.data.SCORE); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    )

    var job_legend_main = svg_job_main.append("g")
    .attr("class", "job_legend_main")
    .attr("transform", "translate(" + (width_job + 130) + ",100)");

  job_legend_main.selectAll("g")
    .data(keys)
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