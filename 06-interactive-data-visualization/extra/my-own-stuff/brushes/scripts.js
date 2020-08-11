var svg = d3.select("svg");

var data = tributary.pics.data.children;
data.forEach(function(d) {
	d.data.created *= 1000
})

var extent = d3.extent(data, function(d) {
	return d.data.created
})

var scale = d3.time.scale()
  .domain(extent)
  .range([10, 463])

var brush = d3.svg.brush()
brush.x(scale)

var g = svg.append("g")
var ch = 30; 

brush(g)
g.attr("transform", "translate(50, 100)")
g.selectAll("rect").attr("height", ch)
g.selectAll(".background")
  .style({fill: "#4B9E9E", visibility: "visible"})
g.selectAll(".extent")
  .style({fill: "#78C5C5", visibility: "visible"})
g.selectAll(".resize rect")
  .style({fill: "#276C86", visibility: "visible"})

var rects = g.selectAll("rect.events")
.data(data)
rects.enter()
.append("rect").classed("events", true)
rects.attr({
  x: function(d) {return scale(d.data.created);},
  y:0, 
  width: 1,
  height: ch
}).style("pointer-events", "none")


brush.on("brushend", function() {
	console.log(brush.extent())
    var ext = brush.extent()
    var filtered = data.filter(function(d) {
		return(d.data.created > ext[0] && d.data.created < ext[1])
    })
    g.selectAll("rect.events")
          .style({stroke: ""})
    g.selectAll("rect.events")
          .data(filtered, function(d) {return d.data.id})
          .style({
              stroke: "#fff"
    	})
}) 