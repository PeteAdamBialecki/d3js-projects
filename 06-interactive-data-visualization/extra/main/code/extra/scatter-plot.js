if(!d3.chart) d3.chart = {};

d3.chart.scatter = function() {
  var data;
  var div;

  function chart(container) {
    div = container;
    var table = div.append("table")
    update();
  }

  function update() {

  }

  chart.highlight = function(data) {
    div.selectAll("tr").selectAll("td")
    .style({
      "background-color": ""
    })
    var trs = div.selectAll("tr")
      .data(data, function(d) { return d.data.id });
    trs.selectAll("td").style({
      "background-color": "orange",
      border: "1px solid black"
    })
  }

  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
  return chart;
}