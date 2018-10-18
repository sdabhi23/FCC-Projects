var url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

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
    h = 380,
    padding = 50;

  const data = mainData.monthlyVariance,
    baseTemp = mainData.baseTemperature;

  console.log(data);

  const svg = d3
    .select("#graphArea")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const maxTemp = d3.max(data, d => d.variance),
    minTemp = d3.min(data, d => d.variance),
    maxYear = d3.max(data, d => d.year),
    minYear = d3.min(data, d => d.year);

  const tempScale = d3
    .scaleSequential(d3.interpolatePlasma)
    .domain([minTemp, maxTemp]);
  const yearScale = d3
    .scaleTime()
    .domain([minYear, maxYear])
    .range([padding + 20, w - 20]);
  const monthScale = d3
    .scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    .range([h - padding, padding]);

  const xAxis = d3
    .axisBottom(yearScale)
    .tickFormat(d3.formatPrefix(".0s", 1e2))
    .tickSizeOuter(0);
  const yAxis = d3
    .axisLeft(monthScale)
    .tickFormat(d => {
      const timeParse = d3.timeFormat("%B");
      const month = timeParse(new Date(1999 + "-" + d));
      return month;
    })
    .tickSizeOuter(0);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding + 20}, 0)`)
    .call(yAxis);

  const legend = svg.append("g").attr("id", "legend");
  const min = minTemp,
    max = maxTemp;

  const legendData = [
    min,
    min + (1 * (max - min)) / 7,
    min + (2 * (max - min)) / 7,
    min + (3 * (max - min)) / 7,
    min + (4 * (max - min)) / 7,
    min + (5 * (max - min)) / 7,
    min + (6 * (max - min)) / 7,
    max
  ];

  legend
    .attr("transform", `translate(${w / 2 - 2 * padding}, ${h - padding / 2})`)
    .style("opacity", "0.8");

  legend
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("width", padding / 2)
    .attr("height", padding / 2)
    .attr("x", (d, i) => (i * padding) / 2)
    .attr("y", 0)
    .style("fill", d => tempScale(d));

  legend
    .selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", (d, i) => (i * padding) / 2 + padding / 4)
    .attr("y", padding / 4)
    .text(d => (d + baseTemp).toFixed(0))
    .attr("class", "legend-text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .style("fill", "#ffffff");

  var tooltip = d3
    .select("#graphArea")
    .append("div")
    .attr("class", "d3-tip")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

  const rects = svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", d => d.month - 1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => d.variance)
    .attr("x", d => yearScale(d.year))
    .attr("y", d => {
      return h - padding - ((h - 2 * padding) / 12) * d.month;
    })
    .attr("width", (w - padding) / data.filter(item => item.month === 1).length)
    .attr("height", (h - 2 * padding) / 12)
    .style("fill", d => tempScale(d.variance))
    .on("mouseover", (d, i) => {
      tooltip
        .style("visibility", "visible")
        .style("left", yearScale(d.year) + 220 + "px")
        .style(
          "top",
          h - padding - ((h - 2 * padding) / 12) * d.month + 50 + "px"
        )
        .attr("data-year", d.year)
        .html(() => {
          const timeParse = d3.timeFormat("%B");
          const month = timeParse(new Date(d.year + "-" + d.month));
          return `${month} ${d.year}<br>Temp: ${(baseTemp + d.variance).toFixed(
            2
          )}&deg;C<br>Var: ${d.variance.toFixed(2)}&deg;C`;
        });
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));
}

document.addEventListener("DOMContentLoaded", () => {
  getData();
});
