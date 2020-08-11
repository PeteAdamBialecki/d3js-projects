var panZoomMaps;
var drawMapFunctions;

panZoomMaps = (typeof panZoomMaps !== 'undefined' && panZoomMaps instanceof Array) ? panZoomMaps : [];
drawMapFunctions = (typeof drawMapFunctions !== 'undefined' && drawMapFunctions instanceof Array) ?
    drawMapFunctions : [];

$.EventBus("currentOrganizationChange").subscribe(function () {
    /*panZoomMaps["${id}"].destroy();*/
    $("#choropleth-map").empty();
    drawMapFunctions["${id}"]();
});

drawMapFunctions["${id}"] = function () {
    var svgMap = d3.select("#choropleth-map");
    width = +svgMap
        .attr("width");
    height = +svgMap
        .attr("height");
    var cbsaMap = d3.map();
    var cbsaNameMap = d3.map();
    var partnerLocale = "us-EN";
    var color = d3.scaleLinear().domain($ {
        domain
    }).range(d3.schemeBlues[$ {
        domain
    }.length])
    var orgId = sessionStorage.getItem("currentOrganizationId");

    if (!orgId) {
        orgId = -1;
    }
    d3.queue()
        .defer(d3.json, "${contextRoot}/2013_us.topojson.json")
        .defer(d3.json, "${baseDataUrl}/" + orgId)
        .await(ready);

    function ready(error, cbsa, d) {

        var width = 960,
            height = 600,
            centered;
        var projection = d3.geoAlbersUsa()
            .scale(1400)
            .translate([width / 2, height / 2]);
        var path = d3.geoPath().projection(projection);
        var svg = d3.select("#choropleth-map");
        width = +svg
            .attr("width");
        height = +svg
            .attr("height");
        svg.append("rect")
            .attr("class", "d3MapBackground")
            .attr("width", width)
            .attr("height", height)
            .on("click", clicked);

        var g = svg.append("g");

        d3.json("${contextRoot}/2013_us.topojson.json", function (error, us) {
            if (error) throw error;

        });

        function clicked(d) {
            if (cbsaMap.has(d.properties.id)) {
                var x, y, k;

                if (d && centered !== d) {
                    var centroid = path.centroid(d);
                    x = centroid[0];
                    y = centroid[1];
                    k = 4;
                    centered = d;
                    $('#btn').click(function () {
                        var btn = $(this);
                        $.post( /*...*/ ).complete(function () {
                            btn.prop('disabled', false);
                        });
                        btn.prop('disabled', true);

                    });
                    $("#mobileDialogBox").css("display", "block").css("visibility", "visible").css("height",
                        "fit-content");
                    $("#dialogBox").css("display", "none").css("visibility", "hidden").css("height",
                        "fit-content");
                } else {
                    x = width / 2;
                    y = height / 2;
                    k = 1;
                    centered = null;
                    $("#dialogBoxCloseButton, #mobileDialogBoxCloseButton").click();
                    $("#dialogBox, #mobileDialogBox").css("display", "table-column").css("visibility", "hidden")
                        .css("height", "0");
                }
                d3.select("#${id}-d3MapCbsa").selectAll("path")
                    .classed("active", centered && function (d) {
                        return d === centered;
                    });

                d3.select("#${id}-d3MapState").transition()
                    .duration(750)
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k +
                        ")translate(" + -x + "," + -y + ")")
                    .attr("transform-origin", "-160px -60px 10px")
                    .style("stroke-width", 0.5 / k + "px");

                d3.select("#${id}-d3MapCbsa").transition()
                    .duration(750)
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k +
                        ")translate(" + -x + "," + -y + ")")
                    .attr("transform-origin", "-160px -60px 10px")
                    .style("stroke-width", 0.5 / k + "px");

                d3.select("#${id}-d3MapStateBorder").transition()
                    .duration(750)
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k +
                        ")translate(" + -x + "," + -y + ")")
                    .attr("transform-origin", "-160px -60px 10px")
                    .style("stroke-width", 0.5 / k + "px");
            }
        }

        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", "none")
            .style("opacity", 0);
        var us = cbsa;
        var svgMap = d3.select("#choropleth-map");
        var mouseDownTime = new Date().getTime();
        var prevMouseUp = new Date().getTime();
        var clicks = 0;
        var timeout;
        var path = d3.geoPath().projection(projection);
        var stateAndMicroColor = "#cccccc";

        if (error)
            throw error;

        if (d.data) {
            for (var i = 0; i < d.data.length; i++) {
                cbsaMap.set(d.data[i].cbsaId, +d.data[i].num);
                cbsaNameMap.set(d.data[i].cbsaId, d.data[i].cbsaName);
            }
        }

        partnerLocale = d.partnerLocale;
        if (partnerLocale) {
            partnerLocale = partnerLocale.replace("_", "-");
        } else {
            partnerLocale = "en-US";
        }
        console.log("locale: " + partnerLocale);

        svgMap.append("g")
            .attr("class", "state")
            .attr("id", "${id}-d3MapState")
            .selectAll("path").data(topojson.feature(us, us.objects.states).features)
            .enter()
            .append("path")
            .attr("fill", function () {
                return stateAndMicroColor;
            })
            .attr("d", path)
            .attr("pointer-events", "none")
            .on("click", clicked);

        svgMap.append("g")
            .attr("class", "cbsa")
            .attr("id", "${id}-d3MapCbsa")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.cbsas).features)
            .enter().append("path")
            .attr("class", function (d) {
                if (cbsaMap.has(d.properties.id)) {
                    return "cbsaPath"
                }
                return "microPath";
            })
            .attr("fill", function (d) {
                if (cbsaMap.has(d.properties.id)) {
                    return color(cbsaMap.get(d.properties.id));
                }
                return stateAndMicroColor;
            })
            .attr("stroke", function (d) {
                // 					return "#ffffff";
                if (cbsaMap.has(d.properties.id)) {
                    // 						return color(cbsaMap.get(d.properties.id));
                    return "#ffffff";
                }
                return stateAndMicroColor;
            })
            .attr("stroke-width", 0.5)
            .attr("d", path)
            .on("click", clicked)
            .on("mouseover", function (d) {
                if (cbsaMap.has(d.properties.id)) {
                    console.log("mouseover: " + d.properties.id);
                    var scrollNumber = window.pageYOffset;
                    var cbsaName = cbsaNameMap.get(d.properties.id);
                    var count = cbsaMap.get(d.properties.id);
                    if (!count) {
                        count = 0;
                    } else {
                        count = count.toLocaleString(partnerLocale);
                    }

                    tooltip.transition()
                        .duration(200)
                        .style("display", "block")
                        .style("opacity", .9);
                    tooltip.html("The name of this Core Based<br/>Statistical Area (CBSA) is <br><b>" +
                            cbsaName + "</b>.<br/> There are a total of <b>" + count +
                            "</b> ${dataInputLabel}")
                        .style("left", (d3.event.pageX + 20) + "px")
                        .style("top", (d3.event.pageY - scrollNumber - 45) + "px");
                    $(".tooltip:contains(transactions), .tooltip:contains(orders)").append(
                        "<br>within the past 42 days").append(".")
                    $(".tooltip:contains(cardholders)").append(".")
                }
            })
            .on("mouseout", function (d) {
                if (cbsaMap.has(d.properties.id)) {
                    tooltip.transition()
                        .duration(500)
                        .style("display", "none")
                        .style("opacity", 0);
                }
            })
            .on("mousedown", function (d) {
                if (cbsaMap.has(d.properties.id)) {
                    mouseDownTime = new Date().getTime();
                    clearTimeout(timeout);
                }
            })
            .on("mouseup", function (d) {
                if (cbsaMap.has(d.properties.id)) {
                    clicks++;
                    if (clicks === 1) {
                        var x = d3.event.pageX - document.getElementById("choropleth-map").getBoundingClientRect()
                            .x + 700;
                        var y = d3.event.pageY - document.getElementById("choropleth-map").getBoundingClientRect()
                            .y + 380;
                        timeout = setTimeout(function () {


                            if (new Date().getTime() - mouseDownTime < 250 && cbsaMap.has(d.properties
                                    .id)) {
                                var cbsaName = cbsaNameMap.get(d.properties.id);
                                var cbsaValue = cbsaMap.get(d.properties.id).toLocaleString(
                                    partnerLocale);
                                $('#dialogText, #mobileDialogText').text("Header");
                                $('#dialogText, #mobileDialogText').html(
                                    "The name of this Core Based Statistical Area<br> (CBSA) is <b>" +
                                    cbsaName + "</b>.<br/> There are a total of <b>" +
                                    cbsaValue + "</b> ${dataInputLabel}. ");

                                /* NOTE: The following function works on smaller devices and viewports with the help of the "#dialogBox" media query.  The dialog box is stuck to the bottom of the map and is updated on CBSA clicking.  Space is made or reduced to fit the dialog box. */
                                /* $('#dialogBox').show().draggable(); */

                                /* NOTE: The following jQuery funtion works on desktop screensizes and not on mobile or tablet.  How can the .offset({}) be adjusted for different screensizes like CSS media queries? */
                                $('#dialogBox, #mobileDialogBox').show().offset({
                                    top: y,
                                    left: x
                                }).draggable();

                                $('#dialogBoxCloseButton, #mobileDialogBoxCloseButton').click(
                                    function () {
                                        $('#dialogBox, #mobileDialogBox').hide();
                                    });

                            }
                            clicks = 0;
                        }, 100);
                    } else if (clicks === 2) {
                        clearTimeout(timeout);
                        $("#dialogBoxCloseButton, #mobileDialogBoxCloseButton").click();
                        clicks = 0;
                    }
                    prevMouseUp = new Date().getTime();
                }
            });

        svgMap.append("g")
            .attr("class", "stateBorder")
            .attr("id", "${id}-d3MapStateBorder")
            .selectAll("path").data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("fill", function () {
                return "transparent";
            })
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 0.5)
            .attr("d", path)
            .attr("pointer-events", "none")
            .on("click", clicked);
    }
}
drawMapFunctions["${id}"]();

/* Closing of the D3 map dialog box upon clicking each of the four CTA's. */
$('#cardholdersCTA, #transactionsCTA, #ordersCTA, #pointsCTA').click(function () {
    $("#dialogBoxCloseButton, #mobileDialogBoxCloseButton").click();
});