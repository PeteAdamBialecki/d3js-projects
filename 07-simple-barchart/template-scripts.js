// 6. Tool Tips

var w = 300;
var h = 120;
var padding = 2;
var dataset = [ 5, 10, 13, 19, 21, 25,
                11, 25, 22, 18, 7];
var svg = d3.select("body").append("svg")
          .attr("width", w)
          .attr("height", h);

function colorPicker(v) {
  if (v<=20) { return "#666666"; }
  else if (v>20) { return "#FF0033"; }
}

svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr({
    x: function(d, i) {return i * (w / dataset.length);},
    y: function(d) {return h - (d*4);},
    width: w / dataset.length - padding,
    height: function(d) {return d*4;},
    fill: function(d) {return colorPicker(d);}
  })
  .on("mouseover", function(d){
    
    svg.append("text")
      .text(d)
      .attr({
        "text-anchor": "middle",
        x: parseFloat(d3.select(this).attr("x")) +
          parseFloat(d3.select(this).attr("width")/2),
        y: parseFloat(d3.select(this).attr("y"))+12,
        "font-family": "sans-serif",
        "font-size": 12,
        "fill": "#ffffff",
        id: "tooltip"
      });
  
})




  .on("mouseout", function(){d3.select("#tooltip").remove()});





































// // 5. Scaling Data

// var scale = d3.scale
//     .linear()
//     .domain([130,350])
//     .range([10,100]);

// // Scale the range to see where the data needs to lie.
// console.log(scale(300));
// console.log(scale(270));



















































// // 4. SCATTER PLOT

// var h = 650;
// var w = 1000;

// monthlySales = [
//     {"month": 10, "sales": 260},
//     {"month": 20, "sales": 140},
//     {"month": 30, "sales": 200},
//     {"month": 40, "sales": 40},
//     {"month": 50, "sales": 500},
//     {"month": 60, "sales": 320},
//     {"month": 70, "sales": 160},
//     {"month": 80, "sales": 300},
//     {"month": 90, "sales": 350},
//     {"month": 100, "sales": 240},
//     {"month": 110, "sales": 130},
//     {"month": 120, "sales": 50},
//     {"month": 130, "sales": 100},
// ];

// // KPI Color
// function salesKPI(d) {
//     if (d>=250) {
//         return "lightgreen";
//     } else if (d < 250) {
//         return "#666666";
//     }
// }

// // Calling for labels
// function showMinMax(ds, col, val, type) {
//     var max = d3.max(ds, function(d) { return d[col];});
//     var min = d3.max(ds, function(d) { return d[col];});
//     if (type == 'minmax' && (val == max || val == min)) {
//         return val;
//     } else {
//         if (type == 'all') {
//             return val;
//         }
//     }
// }

// // Create SVG
// var svg = d3.select("body").append("svg")
//     .attr({ width: w, height: h });

// // Add dots
// var dots = svg.selectAll("circle")
//     .data(monthlySales)
//     .enter()
//     .append("circle")
//     .attr({
//         cx: function(d){
//             return d.month*3+25;},
//         cy: function(d){
//             return h-d.sales-50;},
//         r: 5,
//         "fill": function(d) {
//             return salesKPI(d. sales);
//         }
// });

// // Add labels
// var labels = svg.selectAll("text")
//     .data(monthlySales)
//     .enter()
//     .append("text")
//     .text(function (d) {
//         return showMinMax(monthlySales, 'sales', d.sales, 'all');
//     })
//     .attr({
//         x: function(d){
//             return (d.month*3)-10;},
//         y: function(d){
//             return (h-d.sales)-50;},
//         "font-family": "sans-serif",
//         "font-size": 14,
//         "fill": "#999",
//         "margin": "10px",
//         "text-anchor": "start",
//         "dy": ".35em"
// });




















































// // 3. LINE GRAPH

// var h = 500;
// var w = 1000;

// monthlySales = [
//     {"month": 10, "sales": 20},
//     {"month": 20, "sales": 14},
//     {"month": 30, "sales": 20},
//     {"month": 40, "sales": 4},
//     {"month": 50, "sales": 8},
//     {"month": 60, "sales": 32},
//     {"month": 70, "sales": 16},
//     {"month": 80, "sales": 3},
//     {"month": 90, "sales": 35},
//     {"month": 100, "sales": 25},
//     {"month": 110, "sales": 13},
//     {"month": 120, "sales": 50},
//     {"month": 130, "sales": 1},
// ];

// var lineFun = d3.svg.line()
//     .x(function(d) { return d.month*3; })
//     .y(function(d) { return h-d.sales*5; })
//     .interpolate("linear");
//     // .interpolate("basis");

// var svg = d3.select("body").append("svg").attr({width: w, height: h});
// var viz = svg.append("path")
//     .attr({
//         d: lineFun(monthlySales),
//         "stroke": "hotpink",
//         "stroke-width": 4,
//         "fill": "none"
//     })

// // Add Labels
// var labels = svg.selectAll("text")
//     .data(monthlySales)
//     .enter()
//     .append("text")
// .text(function(d){ return d.sales; })
// .attr({
//     x: function(d){return d.month*3-25;},
//     y: function(d) { return h-d.sales*5;},
//     "font-family": "sans-serif",
//     "font-size": 14,
//     "fill": "#999",
//     "margin": "10px",
//     "text-anchor": "start",
//     "dy": ".35em",
//     "color": function(d, i) {
//         if (i === 0 || (monthlySales.length-1)) {
//             return "red";
//         } else {
//             return "blue";
//         }
//     }
// });

// --------------------------------------------------------

// // 2. BAR CHART

// var w = 1000;
// var h = 500;
// var padding = 5;
// var dataset = [63, 23, 15, 40, 16, 34, 70, 5, 10, 14,  40, 30, 63, 23, 15, 40, 16, 34, 70, 52, 63, 23, 15, 40, 30, 63, 23, 15, 40, 16, 34, 70, 42, 14, 5, 7, 65, 52, 41];
// var svg = d3.select("body").append("svg")
//     .attr("width", w)
//     .attr("height", h);

// function colorPicker(v) {
//     if (v<=20) {return "purple";}
//     else if (v>20) {return "greenflat";}
// }

// // Coloring the bar chart.
// svg.selectAll("rect")
//     .data(dataset)
//     .enter()
//     .append("rect")
//         .attr({
//             x: function(d, i) {return i * (w / dataset.length);},
//             y: function(d) {return h - (d*4);},
//             width: w / dataset.length - padding,
//             height: function(d) {return d*4;},
//             fill: function(d) {return colorPicker(d);}
//         });

// // Bar Labeling.
// svg.selectAll("text")
//     .data(dataset)
//     .enter()
//     .append("text")
//     .text(function(d) { return d; })
//     .attr({
//         "text-anchor": "middle",
//         x: function( d, i ) {return i * (w / dataset.length) + (w / dataset.length - padding) / 2;},
//     y: function(d) { return h - (d*4)+14; },
//     "font-family": "sans-serif",
//     "font-size": 12,
//     "fill": "#999"
// });

// --------------------------------------------------------

// // 1. SIMPLIFIED BAR CHART

// var w = 100;
// var h = 100;
// var padding = 2;
// var dataset = [ 5, 10, 15, 20, 25, 30, 35];
// var svg = d3.select("body").append("svg")
//           .attr("width", w)
//           .attr("height", h);

// svg.selectAll("rect")
//     .data(dataset)
//     .enter()
//     .append("rect")
//         .attr("x", function(d, i) {
//             return (i * (w / dataset.length));
//         })
//         // Flip the bar graph upside down (bars start at the bottom).
//         .attr("y", function(d) {
//             return h - d;
//         })
//         .attr("width", w / dataset.length - padding)
//         .attr("height", function(d) {
//             return d;
//         });