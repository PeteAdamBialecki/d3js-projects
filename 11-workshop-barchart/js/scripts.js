
// This is the final version of the Chicago crimes D3 visualization.

d3.csv("chicago-crimes.csv", ready)

// Ready Function
function ready(error, data) {

    if (error) return console.warn(error);

    data.forEach(function (d) {
        d.count = +d.count; //making sure count reads as a number
        d.year = +d.year; //making sure year reads in as a number
        d.violation = d['Primary Type']; //changing to an easier to use variable name
    });

    // filtering for 2018 data
    var data2018 = data.filter(function (d) { return d.year == 2018 })

    //Define Margins and svg here:
    var margin = { top: 20, right: 70, bottom: 160, left: 45 };

    var width = 820 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define xScale and yScale here:

    var yScale = d3.scaleLinear()
        //     .domain([0, d3.max(data2018, function(d) { return d.count; })])
        .domain([0, 70000])
        .range([height, 0]);

    // Define xAxis and yAxis generators here:  
    var xScale = d3.scaleBand()
        .domain(data2018.map(function (d) { return d.violation; }))
        .padding([.1])
        .rangeRound([0, width]);

    // Append axes here: 
    var xAxis = d3.axisBottom(xScale);

    var xAxisGroup = svg.append("g")
        .attr("class", "x axis") //assigning classes `x` and `axis`
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    xAxisGroup
        .selectAll('text')
        .attr('transform', 'rotate(45) translate(7, -8)')
        .attr('text-anchor', 'start')

    var yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(`.2s`));;

    var yAxisGroup = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);


    // Create bars here:
    // Create bars here:
    svg.selectAll('.bar')
        .data(data2018)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function (d) { return xScale(d.violation) })
        .attr('y', function (d) { return yScale(d.count) })
        .attr('width', xScale.bandwidth())
        .attr('height', function (d) { return height - yScale(d.count) })
        .attr('fill', '#336b87')
        .on('mouseenter', function (d) {
            console.log(d3.select(this))

            d3.select(this)
                .transition()
                .duration(100)
                .attr('fill', '#90afc5')

            var xPosition = parseFloat(d3.select(this).attr('x')) + xScale.bandwidth() / 2;
            var yPosition = parseFloat(d3.select(this).attr("y")) - 5;

            //Create the label
            svg.append("text") //add text
                .attr("id", "countLabel") //give it the id 'countLabel'
                .attr("x", xPosition) //assign x position - calculated above
                .attr("y", yPosition) //assign y position - calculated above
                .attr("text-anchor", "middle") //set text anchor to the middle, so that the text shows up in center of bar
                .attr("font-family", "sans-serif") //add some styling (this can also be done in css section)
                .attr("font-size", "11px")
                .attr("font-weight", "bold")
                .text(d.count);
        })
        .on('mouseleave', function (d) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr('fill', '#336b87')
            d3.select("#countLabel").remove();
        })
}