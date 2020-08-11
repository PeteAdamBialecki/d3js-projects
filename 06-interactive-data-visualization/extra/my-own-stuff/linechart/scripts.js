var svg = d3.select("svg");
var ch = 400;
var data = tributary.pics.data.children
.sort(function(a,b) {
	return a.data.score - b.data.score
});
var maxScore = d3.max(data, function(d) {return d.data.score})
var yScale = d3.scale.linear()
	.domain([0, maxScore])
	.range([0, 400])
var xScale = d3.scale.ordinal()
	.domain(d3.range(data.length))
	.rangeBands([0, 500], 0.5)
var yScaleLine = d3.scale.linear()
	.domain([0, maxScore])
	.range([ch, 0])
var line = d3.svg.line()
.x(function(d,i) {return xScale(i)})
.y(function(d,i) {return yScaleLine(d.data.score)})
// Three different smoothing techniques for generating a line:
//.interpolate("linear")
//.interpolate("cardinal")
.interpolate("basis")

var g = svg.append("g")
	.attr("transform", "translate(11, 100)")

svg.append("path")
.attr("d", line(data))
.style({
  fill: "none",
  stroke: "saddlebrown"
})