var url =
  "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";

function getData() {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.send();
  req.onload = () => {
    json = JSON.parse(req.responseText);
    visualize(json);
  };
}

function visualize(mainData) {
  const w = 1000,
    h = 600,
    padding = 50;

  const svg = d3
    .select("#graphArea")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  var path = d3.geoPath();

  var x = d3
    .scaleLinear()
    .domain([2.6, 75.1])
    .rangeRound([600, 860]);

  var color = d3
    .scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
    .range(d3.schemePuBu[9]);

  var g = svg
    .append("g")
    .attr("class", "key")
    .attr("id", "legend")
    .attr("transform", "translate(0,40)");

  g.selectAll("rect")
    .data(
      color.range().map(function(d) {
        d = color.invertExtent(d);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      })
    )
    .enter()
    .append("rect")
    .attr("height", 8)
    .attr("x", d => x(d[0]))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("fill", d => color(d[0]));

  g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold");

  g.call(
    d3
      .axisBottom(x)
      .tickSize(13)
      .tickFormat(function(x) {
        return Math.round(x) + "%";
      })
      .tickValues(color.domain())
  )
    .select(".domain")
    .remove();

  var tooltip = d3
    .select("#graphArea")
    .append("div")
    .attr("class", "d3-tip")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

  const COUNTY_FILE =
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

  d3.json(COUNTY_FILE).then(ready);

  function ready(us) {
    svg
      .append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("data-fips", d => d.id)
      .attr("data-education", function(d) {
        var result = mainData.filter(obj => obj.fips == d.id);
        if (result[0]) {
          return result[0].bachelorsOrHigher;
        }
        console.log("could find data for: ", d.id);
        return 0;
      })
      .attr("fill", function(d) {
        var result = mainData.filter(obj => obj.fips == d.id);
        if (result[0]) {
          return color(result[0].bachelorsOrHigher);
        }
        return color(0);
      })
      .attr("d", path)
      .on("mouseover", (d, i) => {
        tooltip
          .style("visibility", "visible")
          .style("left", d3.event.pageX + 15 + "px")
          .style("top", d3.event.pageY - 25 + "px")
          .attr("data-education", function() {
            var result = mainData.filter(function(obj) {
              return obj.fips == d.id;
            });
            if (result[0]) {
              return result[0].bachelorsOrHigher;
            }
            return 0;
          })
          .html(() => {
            var result = mainData.filter(function(obj) {
              return obj.fips == d.id;
            });
            if (result[0]) {
              return (
                result[0]["area_name"] +
                ", " +
                result[0]["state"] +
                ": " +
                result[0].bachelorsOrHigher +
                "%"
              );
            }
            return 0;
          });
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));

    svg
      .append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("class", "states")
      .attr("d", path);
  }
  // const rects = svg.selectAll('rect')
  //                     .data(data)
  //                     .enter()
  //                     .append('rect').attr('class', 'cell')
  //                     .attr('data-month', (d) => d.month-1)
  //                     .attr('data-year', (d) => d.year)
  //                     .attr('data-temp', (d) => d.variance)
  //                     .attr('x', (d) => yearScale(d.year))
  //                     .attr('y', (d) => {
  //                         return (h-padding) - (h-2*padding)/12 * (d.month)
  //                     })
  //                     .attr('width', (w-padding)/(data.filter((item) => item.month === 1)).length)
  //                     .attr('height', (h-2*padding)/12)
  //                     .style('fill', (d) => tempScale(d.variance))
  // .on('mouseover', (d, i) => {
  //     tooltip.style("visibility", "visible")
  //             .style('left', yearScale(d.year) + 220 + 'px')
  //             .style('top', (h-padding) - (h-2*padding)/12 * (d.month) + 50 + 'px')
  //             .attr('data-year', d.year)
  //             .html(() => {
  //                 const timeParse = d3.timeFormat("%B")
  //                 const month = timeParse(new Date(d.year + '-' + d.month))
  //                 return `${month} ${d.year}<br>Temp: ${(baseTemp+d.variance).toFixed(2)}&deg;C<br>Var: ${d.variance.toFixed(2)}&deg;C`;
  //             });
  // })
  // .on('mouseout', () => tooltip.style("visibility", "hidden"));
}

document.addEventListener("DOMContentLoaded", () => {
  getData();
});
