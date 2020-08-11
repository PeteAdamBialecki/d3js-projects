var display = d3.select("#display");

var data = tributary.pics.data.children;
console.log(data);

var table = display.append("table")

var rows = table.selectAll("tr.row")
.data(data)

var rowsEnter = rows.enter()
	.append("tr").classed("row", true)

rowsEnter.append("td")
	.text(function(d) {return d.data.score})

rowsEnter.append("td")
	.append("a")
	.attr({
      href: function(d) {return d.data.url}
    })

	.append("img")
	.attr({
      src: function(d) {return d.data.thumbnail}
	})

rowsEnter.append("td")
	.append("a")
	.attr({
      href: function(d) {return d.data.url}
    })
	.text(function(d) {return d.data.title})

rowsEnter.append("td")
	.text(function(d) {return d.data.downs})

rowsEnter.append("td")
	.text(function(d) {return d.data.ups})