function makeLineChart(dataset, xName, yObjs, axisLabels) {
    var chartObj = {};
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var parseTime = d3.timeParse("%Y%m%d");
    var formatTime = d3.timeFormat("%Y-%m-%d");
    chartObj.xAxisLabel = axisLabels.xAxis;
    chartObj.yAxisLeftLabel = axisLabels.yAxisLeft;
    chartObj.yAxisRightLabel = axisLabels.yAxisRight;
    /*
     yObjsects format:
     {y1:{column:'',name:'name',color:'color'},y2}
     */

    chartObj.data = dataset;
    chartObj.margin = {top: 15, right: 60, bottom: 35, left: 50};
    chartObj.width = 650 - chartObj.margin.left - chartObj.margin.right;
    chartObj.height = 480 - chartObj.margin.top - chartObj.margin.bottom;

    // So we can pass the x and y as strings when creating the function
    chartObj.xFunct = function (d) {  	
        return parseTime(d[xName]);
    };

    // For each yObjs argument, create a yFunction
    function getYFn(column) {
        return function (d) {       	
            return d[column];
        };
    }

    // Object instead of array
    chartObj.yFuncts = [];
    for (var y in yObjs) {
        yObjs[y].name = y;
        yObjs[y].yFunct = getYFn(yObjs[y].column); //Need this  list for the ymax function        
        chartObj.yFuncts.push(yObjs[y].yFunct);
    }
    
/* Replace with above... */
/*  yObjs[0].name = yObjs[0].column;
    yObjs[0].yFunct = getYFn(yObjs[0].column); //Need this  list for the ymax function        
    chartObj.yFuncts.push(yObjs[0].yFunct);
    
    yObjs[1].name = yObjs[1].column;
    yObjs[1].yFunct = getYFn(yObjs[1].column); //Need this  list for the ymax function        
    chartObj.yFuncts.push(yObjs[1].yFunct); */
    

    //Formatter functions for the axes
    chartObj.formatAsNumber = d3.format(".0f");
    chartObj.formatAsDecimal = d3.format(".2f");
    chartObj.formatAsCurrency = d3.format("$.2f");
    chartObj.formatAsFloat = function (d) {
        if (d % 1 !== 0) {
            return d3.format(".2f")(d);
        } else {
            return d3.format(".0f")(d);
        }

    };
    chartObj.formatAsDate = function(d){
    	return formatTime(d);
    }

    chartObj.xFormatter = chartObj.formatAsDate;
    chartObj.yFormatter = chartObj.formatAsFloat;
    chartObj.bisectDay = d3.bisector(chartObj.xFunct).left; //< Can be overridden in definition

    //Create scale functions
//     chartObj.xScale = d3.scaleLinear().range([0, chartObj.width]).domain(d3.extent(chartObj.data, chartObj.xFunct)); //< Can be overridden in definition
	chartObj.xScale = d3.scaleTime()
		.domain(d3.extent(chartObj.data, function(d) {
//		console.log("day: "+d.day+", parse: "+parseTime(d.day));    
			return parseTime(d.day);
		}))
		.range([0, width]);

    // Get the max of every yFunct
    chartObj.max = function (fn) {
        return d3.max(chartObj.data, fn);
    };
    chartObj.yScaleLeft = d3.scaleLinear().range([chartObj.height, 0]).domain([0, d3.max(chartObj.yFuncts.map(chartObj.max))]);
    chartObj.yScaleRight = d3.scaleLinear().range([chartObj.height, 0]).domain([0, d3.max(chartObj.yFuncts.map(chartObj.max))]);
    
    //Create axis
    chartObj.xAxis = d3.axisBottom().scale(chartObj.xScale).tickFormat(chartObj.xFormatter).ticks(5); //< Can be overridden in definition
    chartObj.yAxisLeft = d3.axisLeft().scale(chartObj.yScaleLeft).tickFormat(chartObj.yFormatter).ticks(5); //< Can be overridden in definition
    chartObj.yAxisRight = d3.axisRight().scale(chartObj.yScaleRight).tickFormat(chartObj.yFormatter).ticks(5); //< Can be overridden in definition

    // Build line building functions
    function getYScaleFn(yObj) {
        return function (d) {
            return chartObj.yScaleLeft(yObjs[yObj].yFunct(d));
            return chartObj.yScaleRight(yObjs[yObj].yFunct(d));
        };
    }
    for (var yObj in yObjs) {
        yObjs[yObj].line = d3.line()
   						.curve(d3.curveBasis)
   						.x(function (d) {
			            	return chartObj.xScale(chartObj.xFunct(d));
				        })
				        .y(getYScaleFn(yObj));
    }


    chartObj.svg;

    // Change chart size according to window size
    chartObj.update_svg_size = function () {
        chartObj.width = parseInt(chartObj.chartDiv.style("width"), 10) - (chartObj.margin.left + chartObj.margin.right);
        chartObj.height = parseInt(chartObj.chartDiv.style("height"), 8) - (chartObj.margin.top + chartObj.margin.bottom);

        /* Update the range of the scale with new width/height */
        chartObj.xScale.range([0, chartObj.width]);
        chartObj.yScaleLeft.range([chartObj.height, 0]);
        chartObj.yScaleRight.range([chartObj.height, 0]);

        if (!chartObj.svg) {
            return false;
        }

        /* Else Update the axis with the new scale */
        chartObj.svg.select('.x.axis').attr("transform", "translate(0," + chartObj.height + ")").call(chartObj.xAxis);
        chartObj.svg.select('.x.axis .label').attr("x", chartObj.width / 2);
        chartObj.svg.select('.y.axis').call(chartObj.yAxisLeft);
        chartObj.svg.select('.y.axis').call(chartObj.yAxisRight);
        chartObj.svg.select('.y.axis .label').attr("x", -chartObj.height / 2);

        /* Force D3 to recalculate and update the line */
        for (var y in yObjs) {
            yObjs[y].path.attr("d", yObjs[y].line);
        }


        d3.selectAll(".focus.line").attr("y2", chartObj.height);

        chartObj.chartDiv.select('svg').attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin.right)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom));
        chartObj.chartDiv.select('svg').attr("width", chartObj.width + (chartObj.margin.right + chartObj.margin.left)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom));
        chartObj.svg.select(".overlay").attr("width", chartObj.width).attr("height", chartObj.height);
        return chartObj;
    };

    chartObj.bind = function (selector) {
        chartObj.mainDiv = d3.select(selector);
        // Add all the divs to make it centered and responsive
        chartObj.mainDiv.append("div").attr("class", "inner-wrapper").append("div").attr("class", "outer-box").append("div").attr("class", "inner-box");
        chartSelector = selector + " .inner-box";
        chartObj.chartDiv = d3.select(chartSelector);
        d3.select(window).on('resize.' + chartSelector, chartObj.update_svg_size);
        chartObj.update_svg_size();
        return chartObj;
    };

    // Render the chart
    chartObj.render = function () {
        //Create SVG element
        chartObj.svg = chartObj.chartDiv
       							.append("svg")
       							.attr("class", "chart-area")
       							.attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin.right))
       							.attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom))
       							.append("g")
       							.attr("transform", "translate(" + chartObj.margin.left + "," + chartObj.margin.top + ")");

        // Draw Lines
        for (var y in yObjs) {
            yObjs[y].path = chartObj.svg
           								.append("path")
           								.datum(chartObj.data)
           								.attr("class", "line")
           								.attr("d", yObjs[y].line)
           								.style("stroke", color(y))
           								.attr("data-series", y)
           								.on("mouseover", function () {
							                focus.style("display", null);
							            }).on("mouseout", function () {
							                focus.transition().delay(700).style("display", "none");
							            }).on("mousemove", mousemove);
        }


        // Draw Axis
        chartObj.svg.append("g")
        		.attr("class", "x axis")
        		.attr("transform", "translate(0," + chartObj.height + ")")
        		.call(chartObj.xAxis)
        		.append("text")
        		.attr("class", "label")
        		.attr("x", chartObj.width / 2).attr("y", 30)
        		.style("text-anchor", "middle")
        		.text(chartObj.xAxisLabel);

        chartObj.svg.append("g")
	        .attr("class", "y axis left")
	        .call(chartObj.yAxisLeft)
	        .append("text")
	        .attr("class", "label")
	        .attr("transform", "rotate(-90)")
	        .attr("y", -57)
	        .attr("x", -chartObj.height / 2)
	        .attr("dy", ".71em")
	        .style("text-anchor", "middle")
	        .text(chartObj.yAxisLeftLabel);

        chartObj.svg.append("g")
	        .attr("class", "y axis right")
	        .call(chartObj.yAxisRight)
	        .append("text")
	        .attr("class", "label")
	        .attr("transform", "rotate(-90)")
	        .attr("y", -57)
	        .attr("x", -chartObj.height / 2)
	        .attr("dy", "1.51em")
	        .style("text-anchor", "middle")
	        .text(chartObj.yAxisRightLabel);
        
        //Draw tooltips
        var focus = chartObj.svg.append("g").attr("class", "focus").style("display", "none");

        for (var y in yObjs) {
            yObjs[y].tooltip = focus.append("g");
            yObjs[y].tooltip.append("circle").attr("r", 5);
            yObjs[y].tooltip.append("rect").attr("x", 8).attr("y", "-5").attr("width", 22).attr("height", '0.75em');
            yObjs[y].tooltip.append("text").attr("x", 9).attr("dy", ".35em");
        }


        // Day label
        focus.append("text").attr("class", "focus day").attr("x", 9).attr("y", 7);

        // Focus line
        focus.append("line").attr("class", "focus line").attr("y1", 0).attr("y2", chartObj.height);

        //Draw legend
        var legend = chartObj.mainDiv.append('div').attr("class", "legend");
        for (var y in yObjs) {
            series = legend.append('div');
            series.append('div').attr("class", "series-marker").style("background-color", color(y));
            series.append('p').text(y);
            yObjs[y].legend = series;
        }

        // Overlay to capture hover
        chartObj.svg.append("rect").attr("class", "overlay").attr("width", chartObj.width).attr("height", chartObj.height).on("mouseover", function () {
            focus.style("display", null);
        }).on("mouseout", function () {
            focus.style("display", "none");
        }).on("mousemove", mousemove);

        return chartObj;

        function mousemove() {
            var x0 = chartObj.xScale.invert(d3.mouse(this)[0]),
                i = chartObj.bisectDay(dataset, x0, 1),
                d0 = chartObj.data[i - 1],
                d1 = chartObj.data[i];
            try {
                var d = x0 - chartObj.xFunct(d0) > chartObj.xFunct(d1) - x0 ? d1 : d0;
            } catch (e) {
                return;
            }
            minY = chartObj.height;
            for (var y in yObjs) {
                yObjs[y].tooltip.attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(d)) + "," + chartObj.yScaleLeft(yObjs[y].yFunct(d)) + ")");
                yObjs[y].tooltip.attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(d)) + "," + chartObj.yScaleRight(yObjs[y].yFunct(d)) + ")");
                yObjs[y].tooltip.select("text").text(chartObj.yFormatter(yObjs[y].yFunct(d)));
                minY = Math.min(minY, chartObj.yScaleLeft(yObjs[y].yFunct(d)));
                minY = Math.min(minY, chartObj.yScaleRight(yObjs[y].yFunct(d)));
            }

            focus.select(".focus.line").attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(d)) + ")").attr("y1", minY);
            focus.select(".focus.day").text("Day: " + chartObj.xFormatter(chartObj.xFunct(d)));

        }

    };
    return chartObj;
}
