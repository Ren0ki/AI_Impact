var margin = {top: 10, right: 30, bottom: 10, left: 60},
    width = 500 - margin.left - margin.right,
    height = 180 - margin.top - margin.bottom;

  var svg_job = d3.select("#job_capability")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/JOB_CAPABILITY.csv", function(data) {

  var keys = data.columns.slice(1)

  //X AXIS
   var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.SCORE; }))
    .range([ 0, width ]);
  svg_job.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(2));

    //Y AXIS
     var y = d3.scaleLinear()
    .domain([0, 20000])
    .range([ height, 0 ]);
  svg_job.append("g")
    .call(d3.axisLeft(y));

     var color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'])

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

}) 