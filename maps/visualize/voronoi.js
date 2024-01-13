/* Adapted from https://strongriley.github.io/d3/ex/voronoi.html */

var margins = {top: 0, right: 0, bottom: 0, left: 0},
    height = 580 - margins.top - margins.bottom,
    width =  580 - margins.left - margins.right;

var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([0, height]);
var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

var clusterColor = d3.scale.category10();
var fillColor = d3.scale.linear().domain([1, 5]).range(["blue", "yellow"]);
var fillOpacity = 0.3;
var hoverOpacity = 0.7;

var svg = d3.select("#target").append("svg")
    .attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.top + margins.bottom)
    .append("g")
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

var tooltip = d3.select("#target").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var makeValidID = function(s) {
    return "#" + s.replace(/[^a-zA-Z]/g, "-");
};

var updateColor = function(d, i) {
    svg.select(makeValidID(d.name))
        .style("opacity", hoverOpacity)
        .style("fill", function (d) { return clusterColor(d.cluster); });
};

var resetColor = function(d, i) {
    svg.select(makeValidID(d.name))
        .style("opacity", fillOpacity)
        .style("fill", function (d) { return fillColor(d.weight); });
};

var tooltipOffset = {"left": 0, "top": 20};

var allData = [{"x": 37.8705256863629, "y": -122.254925966263, "cluster": 0, "name": "Ramona's Caf\u00e9", "weight": 1.9135618479880778}, {"x": 37.868755, "y": -122.258869, "cluster": 0, "name": "San Francisco Soup Company", "weight": 2.985096870342772}, {"x": 37.8666266, "y": -122.2563918, "cluster": 0, "name": "Crossroads", "weight": 1.9135618479880778}, {"x": 37.8677609, "y": -122.2582175, "cluster": 0, "name": "Manhattan Roast & Grill", "weight": 2.985096870342772}, {"x": 37.8672496, "y": -122.2588542, "cluster": 0, "name": "Pasta-In-A-Box", "weight": 1.9135618479880778}, {"x": 37.8677205, "y": -122.2595445, "cluster": 0, "name": "Cheese 'N' Stuff", "weight": 1.5}, {"x": 37.868041, "y": -122.25849, "cluster": 0, "name": "I.B.'s Hoagies", "weight": 2.0}, {"x": 37.8733141647778, "y": -122.264895737171, "cluster": 1, "name": "Pat Brown's Grill", "weight": 1.9135618479880778}, {"x": 37.8755024, "y": -122.2602129, "cluster": 1, "name": "Hummingbird Express", "weight": 2.985096870342772}, {"x": 37.8756879, "y": -122.26004, "cluster": 1, "name": "The Stuffed Inn", "weight": 2.985096870342772}, {"x": 37.8684118, "y": -122.2590117, "cluster": 0, "name": "The Toaster Oven", "weight": 1.9135618479880778}, {"x": 37.8674301, "y": -122.2588366, "cluster": 0, "name": "Pappy's Grill & Sports Bar", "weight": 2.985096870342772}, {"x": 37.8724079738015, "y": -122.260690033436, "cluster": 1, "name": "Free Speech Movement Cafe", "weight": 1.9135618479880778}, {"x": 37.8752289, "y": -122.2601962, "cluster": 1, "name": "Northside Cafe", "weight": 3.0}, {"x": 37.868272, "y": -122.259354, "cluster": 0, "name": "Foley's Deli", "weight": 1.9135618479880778}, {"x": 37.8686641, "y": -122.2594514, "cluster": 0, "name": "Subway", "weight": 1.9135618479880778}, {"x": 37.8677549, "y": -122.2589892, "cluster": 0, "name": "Smart Alec's Intelligent Food", "weight": 2.985096870342772}, {"x": 37.8698057886903, "y": -122.259603738785, "cluster": 0, "name": "Golden Bear Cafe", "weight": 4.5}, {"x": 37.8753118, "y": -122.2602115, "cluster": 1, "name": "Vinnie's Cheesesteaks", "weight": 2.985096870342772}, {"x": 37.8684351, "y": -122.2606426, "cluster": 0, "name": "Cafe Espresso Experience", "weight": 1.9135618479880778}, {"x": 37.868292, "y": -122.259359, "cluster": 0, "name": "Sam's Market", "weight": 1.9135618479880778}, {"x": 37.8754914, "y": -122.2603537, "cluster": 1, "name": "Hummingbird Cafe", "weight": 2.985096870342772}, {"x": 37.8752481, "y": -122.2601606, "cluster": 1, "name": "Zach's Snacks", "weight": 1.5}];

(function(data) {
    // extents of Berkeley restaurants
    x.domain([-122.272, -122.248]).nice();
    y.domain([37.88, 37.86]).nice();

    var voronoi = d3.geom.voronoi().clipExtent([[0, 0], [width, height]]);
    var polygons = voronoi(data.map(function (d) { return [x(d.y), y(d.x), d.weight]; }))
            .map(d3.geom.polygon);
    polygons.forEach(function (val, i, arr) {
        val.weight = data[i].weight;
        val.name = data[i].name;
        val.cluster = data[i].cluster;
    });

    svg.selectAll("path")
        .data(polygons)
        .enter()
        .append("path")
        .attr("class", "cell")
        .attr("id", function (d) { return makeValidID(d.name).substr(1); })
        .attr("stroke", "black")
        .style("opacity", fillOpacity)
        .style("fill", function (d) { return fillColor(d.weight); })
        .attr("d", function (d) { return "M" + d.join("L") + "Z"; })
        .on("mouseover", function (d, i) {
            updateColor(d);
        })
        .on("mousemove", function(d, i) {
            tooltip.transition()
                .duration(100)
                .style("opacity", 0.9);
            tooltip.html(d.name + " (" + Math.round(d.weight * 100) / 100 + ")")
                .style("left", (d3.mouse(this)[0] + tooltipOffset.left) + "px")
                .style("top", (d3.mouse(this)[1]+ tooltipOffset.top) + "px");
        })
        .on("mouseout", function (d, i) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
            resetColor(d);
        });

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", function (d) { return 4; })
        .attr("cx", function(d) { return x(d.y); })
        .attr("cy", function(d) { return y(d.x); })
        .style("fill", function(d) { return clusterColor(d.cluster); })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(100)
                .style("opacity", 0.9);
            tooltip.html(d.name + " (" + Math.round(d.weight * 100) / 100 + ")")
                .style("left", (d3.mouse(this)[0] + tooltipOffset.left) + "px")
                .style("top", (d3.mouse(this)[1] + tooltipOffset.top) + "px");
            updateColor(d);
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
            resetColor(d);
        });
})(allData);
