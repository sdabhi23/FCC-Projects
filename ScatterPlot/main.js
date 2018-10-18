var url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

function getData() {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.send();
  req.onload = () => {
    json = JSON.parse(req.responseText);
    visualize(json);
  };
}

function visualize(data) {
  var yMargin = 40,
    w = 800,
    h = 400;

  console.log(data);

  const svg = d3
    .select("#graphArea")
    .append("svg")
    .attr("width", w + 100)
    .attr("height", h + 60);

  var x = d3.scaleLinear().range([0, w]);
  var y = d3.scaleTime().range([0, h]);
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var timeParse = d3.timeParse("%M:%S");
  var timeFormat = d3.timeFormat("%M:%S");
  var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
  var yAxis = d3.axisLeft(y).tickFormat(timeFormat);

  data.forEach(d => (d.Time = timeParse(d.Time)));

  var timeMin = new Date("Mon Jan 01 1900 00:36:30");
  var timeMax = new Date("Mon Jan 01 1900 00:40:00");

  var tooltip = d3
    .select("#graphArea")
    .append("div")
    .attr("class", "d3-tip")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

  x.domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)]);
  y.domain([timeMin, timeMax]);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(60," + (h + 20) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(60, 20)")
    .call(yAxis);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -270)
    .attr("y", 20)
    .style("font-size", 18)
    .text("Best Time (minutes)")
    .style("font-family", "'Nunito', sans-serif");

  svg
    .append("text")
    .attr("x", 450)
    .attr("y", 460)
    .style("font-size", 18)
    .text("Year")
    .style("font-family", "'Nunito', sans-serif");

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("cx", d => x(d.Year))
    .attr("cy", d => y(d.Time))
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => d.Time)
    .style("transform", "translate(60px, 20px)")
    .attr("data-legend", d => color(d.Doping != ""))
    .style("fill", d => color(d.Doping != ""))
    .on("mouseover", (d, i) => {
      tooltip
        .style("visibility", "visible")
        .style("left", x(d.Year) + 220 + "px")
        .style("top", y(d.Time) + (d.Doping ? 40 : 60) + "px")
        .style("transform", "translateX(60px)")
        .attr("data-year", d.Year)
        .html(
          d.Name +
            ": " +
            d.Nationality +
            "<br>" +
            "Year: " +
            d.Year +
            "<br>Time: " +
            timeFormat(d.Time) +
            (d.Doping ? "<br>  " + d.Doping : "")
        );
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));

  var legend = svg
    .selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

  legend
    .append("rect")
    .attr("x", w + 10)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend
    .append("text")
    .attr("x", w + 5)
    .attr("y", 9)
    .attr("class", "legend-text")
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(
      d => (d ? "Riders with doping allegations" : "No doping allegations")
    );
}

document.addEventListener("DOMContentLoaded", () => {
  getData();
});
