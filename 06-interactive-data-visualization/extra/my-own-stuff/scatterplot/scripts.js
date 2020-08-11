// Go to this working Tributary.io working IDE.  This directory is just meant to keep the code safe as a backup.

var svg = d3.select("svg");
var data = tributary.pics.data.children
	.sort(function(a,b) {
	return a.data.score - b.data.score
	});
var maxScore = d3.max(data, function(d) {return d.data.score})
var yScale = d3.scale.linear()
	.domain([0, maxScore])
	.range([500, 0])
var g = svg.append("g")
.attr("transform", "translate(0, -10)")

var circles = g.selectAll("circles")
.data(data)

console.log(circles) 

circles.enter()
	.append("circle")
	.attr({
      cx: function(d,i) {return 10 + i * 15},
      cy: function(d, i) {return yScale(d.data.score)},
		r:5
})

.on("mouseover", function(d) {
	console.log(d);
})

