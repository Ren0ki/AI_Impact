var margin_job = {top: 0, right: -160, bottom: -30, left: 150},
    width_job = 200 - margin_job.left - margin_job.right,
    height_job = 130 - margin_job.top - margin_job.bottom;

  var svg_job = d3.select("#job_capability")
  .append("svg")
    .attr("width", width_job + margin_job.left + margin_job.right)
    .attr("height", height_job + margin_job.top + margin_job.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_job.left + "," + margin_job.top + ")");

    d3.csv("data/JOB_CAPABILITY.csv", function(data) {

  var keys = data.columns.slice(1)

  //X AXIS
   var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.SCORE; }))
    .range([ 0, width_job ]);
  svg_job.append("g")
    .attr("transform", "translate(0," + height_job + ")")
    .call(d3.axisBottom(x).ticks(2));

    //Y AXIS
     var y = d3.scaleLinear()
    .domain([0, 20000])
    .range([ height_job, 0 ]);
  svg_job.append("g")
    .call(d3.axisLeft(y));

     var color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#538cf4','#f8c954','#ff7f00','#3067d0', '#d34e21','#44a953','#68bbc3','#8f1f15'])

    var stackedData = d3.stack()
    .keys(keys)
    (data)

   svg_job
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

    //LEGEND

       svg_job
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

      var job_legend = svg_job.append("g")
    .attr("class", "job_legend")
     .attr("transform", "translate(" + (width_job - 430) + ",0)");

  job_legend.selectAll("g")
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