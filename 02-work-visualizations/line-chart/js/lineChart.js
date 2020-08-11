d3.csv('multiline_data_days_small.csv', function(error, data) {
    data.forEach(function (d) {
        d.day = +d.day;
        d.cardholdersEnrolled = +d.cardholdersEnrolled;
        d.cardholdersRegistered = +d.cardholdersRegistered;
        d.ordersPerDay = +d.ordersPerDay;
        d.pointsPerDay = +d.pointsPerDay;
        d.transactionsPerDay = +d.transactionsPerDay;
        d.pointsEarnedPerDay = +d.pointsEarnedPerDay;
    });
    var chart = makeLineChartFunctions(data, 'day', {
        'Enrolled': {column: 'cardholdersEnrolled'},
        'Registered': {column: 'cardholdersRegistered'},
        'Orders': { column: 'ordersPerDay' },
        'Points': { column: 'pointsPerDay' },
        'Transactions': { column: 'transactionsPerDay' },
        'Points Earned': { column: 'pointsEarnedPerDay' }
    }, {xAxis: 'Days', yAxis: 'Amount'});
    chart.bind("#chart-line1");
    chart.render();
});

// This is where "multiline-new.js" begins:

var makeLineChartFunctions;
    makeLineChartFunctions = (typeof makeLineChartFunctions !== 'undefined' && makeLineChartFunctions instanceof Array) ?
    makeLineChartFunctions : [];

    makeLineChartFunctions["d3-line-chart"] = function (dataset, xName, yObjs, axisLabels) {
    var chartObj = {};
    var color = d3.scaleOrdinal(d3.schemeSet1);
    var parseTime = d3.timeParse("%Y%m%d");
    var formatTime = d3.timeFormat("%Y-%m-%d");
    chartObj.xAxisLabel = axisLabels.xAxis;
    chartObj.yAxisLeftLabel = axisLabels.axisLeft;
    chartObj.yAxisRightLabel = axisLabels.axisRight;
    chartObj.data = dataset;
    chartObj.margin = {
        top: 15,
        right: 50,
        bottom: 35,
        left: 60
    };
    chartObj.width = 650 - chartObj.margin.left - chartObj.margin.right;
    chartObj.height = 240 - chartObj.margin.top - chartObj.margin.bottom;

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
    chartObj.formatAsDate = function (d) {
        return formatTime(d);
    }
    chartObj.xFormatter = chartObj.formatAsDate;
    chartObj.yFormatter = chartObj.formatAsFloat;
    chartObj.bisectDay = d3.bisector(chartObj.xFunct).left; //< Can be overridden in definition

    // Create scale functions
    // chartObj.xScale = d3.scaleLinear().range([0, chartObj.width]).domain(d3.extent(chartObj.data, chartObj.xFunct)); //< Can be overridden in definition
    chartObj.xScale = d3.scaleTime()
        .domain(d3.extent(chartObj.data, function (d) {
            return parseTime(d.day);
        }))
        .range([0, chartObj.width]);

    // Get the max of every yFunct
    chartObj.max = function (fn) {
        return d3.max(chartObj.data, fn);
    };

    var myvar = chartObj.yFuncts.map(chartObj.max);

    var myval0 = d3.max(chartObj.data, yObjs["${columnNames[0]}"].yFunct);
    var myval1 = d3.max(chartObj.data, yObjs["${columnNames[1]}"].yFunct);

    // chartObj.yScaleLeft = d3.scaleLinear().range([chartObj.height, 0]).domain([0, d3.max(chartObj.yFuncts.map(chartObj.max))]);
    // chartObj.yScaleRight = d3.scaleLinear().range([chartObj.height, 0]).domain([0, d3.max(chartObj.yFuncts.map(chartObj.max))]);

    chartObj.yScaleLeft = d3.scaleLinear().range([chartObj.height, 0]).domain([0, myval0]);
    chartObj.yScaleRight = d3.scaleLinear().range([chartObj.height, 0]).domain([0, myval1]);

    // Create axis
    chartObj.xAxis = d3.axisBottom().scale(chartObj.xScale).tickFormat(chartObj.xFormatter).ticks(5).tickFormat(
        ""); //< Can be overridden in definition
    chartObj.axisLeft = d3.axisLeft().scale(chartObj.yScaleLeft).tickFormat(chartObj.yFormatter).ticks(4); //< Can be overridden in definition
    chartObj.axisRight = d3.axisRight().scale(chartObj.yScaleRight).tickFormat(chartObj.yFormatter).ticks(5); //< Can be overridden in definition

    // Build line function   
    function getYScaleFnLeft(yObj) {
        return function (d) {
            return chartObj.yScaleLeft(yObjs[yObj].yFunct(d));
        };
    }

    function getYScaleFnRight(yObj) {
        return function (d) {
            return chartObj.yScaleRight(yObjs[yObj].yFunct(d));
        };
    }


    yObjs["${columnNames[0]}"].line = d3.line()
        .curve(d3.curveCardinal)
        .x(function (d) {
            return chartObj.xScale(chartObj.xFunct(d));
        }).y(getYScaleFnLeft("${columnNames[0]}"));

    yObjs["${columnNames[1]}"].line = d3.line()
        .curve(d3.curveCardinal)
        .x(function (d) {
            return chartObj.xScale(chartObj.xFunct(d));
        }).y(getYScaleFnRight("${columnNames[1]}"));

    chartObj.svg;

    // Change chart size according to window size
    chartObj.update_svg_size = function () {
        chartObj.width = parseInt(chartObj.chartDiv.style("width")) - (chartObj.margin.left + chartObj.margin
            .right);
        chartObj.height = parseInt(chartObj.chartDiv.style("height")) * 0.7 - (chartObj.margin.top +
            chartObj.margin.bottom);
        console.log("chart height: " + chartObj.height);

        /* Update the range of the scale with new width/height */
        chartObj.xScale.range([0, chartObj.width]);
        chartObj.yScaleRight.range([chartObj.height, 0]);
        chartObj.yScaleLeft.range([chartObj.height, 0]);

        if (!chartObj.svg) {
            return false;
        }

        /* Else Update the axis with the new scale */
        chartObj.svg.select('.x.axis').attr("transform", "translate(0," + chartObj.height + ")").call(
            chartObj.xAxis);
        chartObj.svg.select('.x.axis .label').attr("x", chartObj.width / 2);
        chartObj.svg.select('.y.axis.right').call(chartObj.axisRight).attr("transform", "translate( " +
            chartObj.width + ", 0 )");
        chartObj.svg.select('.y.axis.left').call(chartObj.axisLeft);
        chartObj.svg.select('.y.axis .label').attr("x", -chartObj.height / 2);

        /* Force D3 to recalculate and update the line */
        for (var y in yObjs) {
            yObjs[y].path.attr("d", yObjs[y].line);
        }


        d3.selectAll(".focus.line").attr("y2", chartObj.height);

        chartObj.chartDiv.select('svg').attr("width", chartObj.width + (chartObj.margin.right + chartObj.margin
            .left)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom));
        chartObj.chartDiv.select('svg').attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin
            .right)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom));
        chartObj.svg.select(".overlay").attr("width", chartObj.width).attr("height", chartObj.height);
        return chartObj;
    };

    chartObj.bind = function (selector) {
        chartObj.mainDiv = d3.select(selector);
        // Add all the divs to make it centered and responsive
        chartObj.mainDiv.append("div").attr("class", "inner-wrapper").append("div").attr("class",
            "outer-box").append("div").attr("class", "inner-box");
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
            // I have divided "chartObj.width" below by 1.05 to accomodate for devices sized 320 - 400px on initial page load. Initial width of SVG needed to be below ~355px. (P. Bialecki)
            .attr("width", chartObj.width / 1.05 + (chartObj.margin.left + chartObj.margin.right) + 50)
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
            .attr("x", chartObj.width / 2).attr("y", 20)
            .style("text-anchor", "middle")
            .style("letter-spacing", "0.8px")
            .text(chartObj.xAxisLabel);

        chartObj.svg.append("g")
            .attr("class", "y axis left")
            .call(chartObj.axisLeft)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -57)
            .attr("x", -chartObj.height / 2)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .style("letter-spacing", "0.8px")
            .text(chartObj.yAxisLeftLabel);

        chartObj.svg.append("g")
            .attr("class", "y axis right")
            .attr("transform", "translate( " + chartObj.width + ", 0 )")
            .call(chartObj.axisRight)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -57)
            .attr("x", -chartObj.height / 2)
            .attr("dy", "0.71em")
            .style("text-anchor", "middle")
            .text(chartObj.yAxisRightLabel);

        //Draw tooltips
        var focus = chartObj.svg.append("g").attr("class", "focus").style("display", "none");

        for (var y in yObjs) {
            yObjs[y].tooltip = focus.append("g");
            yObjs[y].tooltip.append("circle").attr("r", 5).style("fill", "#797979");
            yObjs[y].tooltip.append("rect").attr("x", 8).attr("y", "-5").attr("width", 35).attr("height",
                '0.95em').style("fill", "#fff").style("opacity", "0.8");
            yObjs[y].tooltip.append("text").attr("x", 9).attr("dy", ".35em");
        }


        // Day label
        focus.append("text").attr("class", "focus day").attr("x", 9).attr("y", -3);

        // Focus line
        focus.append("line").attr("class", "focus line").attr("y1", 0).attr("y2", chartObj.height);

        //Draw legend
        var legend = chartObj.mainDiv.append('div').attr("class", "legend").attr("transform", "translate( " +
            chartObj.width + ", 0 )");
        for (var y in yObjs) {
            series = legend.append('div');
            series.append('div').attr("class", "series-marker").style("background-color", color(y));
            series.append('p').text(y);
            yObjs[y].legend = series;
        }

        // Overlay to capture hover
        chartObj.svg.append("rect").attr("class", "overlay").attr("width", chartObj.width).style("cursor",
            "crosshair").attr("height", chartObj.height).on("mouseover", function () {
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

            yObjs["${columnNames[0]}"]
            .tooltip.attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(
                d)) + "," + chartObj.yScaleLeft(yObjs["${columnNames[0]}"].yFunct(d)) + ")");
            yObjs["${columnNames[0]}"].tooltip.select("text").text(chartObj.yFormatter(yObjs[
                "${columnNames[0]}"].yFunct(d)));
            minY = Math.min(minY, chartObj.yScaleLeft(yObjs["${columnNames[0]}"].yFunct(d)));

            yObjs["${columnNames[1]}"].tooltip.attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(
                d)) + "," + chartObj.yScaleRight(yObjs["${columnNames[1]}"].yFunct(d)) + ")");
            yObjs["${columnNames[1]}"].tooltip.select("text").text(chartObj.yFormatter(yObjs[
                "${columnNames[1]}"].yFunct(d)));
            minY = Math.min(minY, chartObj.yScaleRight(yObjs["${columnNames[1]}"].yFunct(d)));

            focus.select(".focus.line").attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(d)) +
                ")").attr("y1", minY);
            focus.select(".focus.day").text("Day: " + chartObj.xFormatter(chartObj.xFunct(d)));
        }
    };
    return chartObj;
}