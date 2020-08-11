var svg = d3.select("svg");
var ch = 400;
var data = tributary.pics.data.children;
var maxScore = d3.max(data, function(d) {return d.data.score})
var xScale = d3.scale.ordinal()
	.domain(d3.range(data.length))
	.rangeBands([0, 500], 0.5)
var yScale = d3.scale.linear()
	.domain([0, maxScore])
	.range([0, 400])
var g = svg.append("g")
	.attr("transform", "translate(11, 100)")
var bars = g.selectAll("rect")
	.data(data)

bars.enter()
.append("rect")

bars.attr({
  x: function(d, i) {return i * 12},
  y: function(d,i) {return ch - yScale(d.data.score)},
  width: xScale.rangeBand,
  height: function(d,i) {return yScale(d.data.score)}
})