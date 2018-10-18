function visualize() {
  const url =
    "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

  const w = 1000,
    h = 575;

  const svg = d3
    .select("#graphArea")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("id", "mainGraph");

  function fader(color) {
    return d3.interpolateRgb(color, "#fff")(0.2);
  }

  var color = d3.scaleOrdinal(d3.schemePaired.map(fader)),
    format = d3.format(",d");

  var treemap = d3
    .treemap()
    .size([w, h])
    .paddingInner(1);

  var tooltip = d3
    .select("#graphArea")
    .append("div")
    .attr("class", "d3-tip")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

  d3.json(url).then(data => {
    console.log("got into d3.json");

    var root = d3
      .hierarchy(data)
      .eachBefore(
        d =>
          (d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name)
      )
      .sum(sumBySize)
      .sort((a, b) => b.height - a.height || b.value - a.value);

    treemap(root);

    var cell = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("class", "group")
      .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")");

    var tile = cell
      .append("rect")
      .attr("id", d => d.data.id)
      .attr("class", "tile")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr("fill", d => color(d.data.category))
      .on("mouseover", (d, i) => {
        tooltip
          .style("visibility", "visible")
          .style("left", d3.event.pageX + 20 + "px")
          .style("top", d3.event.pageY - 28 + "px")
          .attr("data-value", d.data.value)
          .html(
            "Name: " +
              d.data.name +
              "<br>Category: " +
              d.data.category +
              "<br>Value: " +
              d.data.value
          );
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));

    cell
      .append("text")
      .attr("class", "tile-text")
      .selectAll("tspan")
      .data(function(d) {
        return d.data.name.split(/(?=[A-Z][^A-Z])/g);
      })
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 13 + i * 10)
      .text(d => d);

    var categories = root.leaves().map(nodes => nodes.data.category);
    categories = categories.filter(
      (category, index, self) => self.indexOf(category) === index
    );
    var legend = d3
      .select("#graphArea")
      .append("svg")
      .attr("width", 1000)
      .attr("id", "legend");
    var legendWidth = +legend.attr("width");
    const LEGEND_OFFSET = 10;
    const LEGEND_RECT_SIZE = 15;
    const LEGEND_H_SPACING = 150;
    const LEGEND_V_SPACING = 10;
    const LEGEND_TEXT_X_OFFSET = 3;
    const LEGEND_TEXT_Y_OFFSET = -2;
    var legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);

    var legendElem = legend
      .append("g")
      .attr("transform", "translate(60," + LEGEND_OFFSET + ")")
      .selectAll("g")
      .data(categories)
      .enter()
      .append("g")
      .attr("transform", (d, i) => {
        return (
          "translate(" +
          (i % legendElemsPerRow) * LEGEND_H_SPACING +
          "," +
          (Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
            LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow)) +
          ")"
        );
      });

    legendElem
      .append("rect")
      .attr("width", LEGEND_RECT_SIZE)
      .attr("height", LEGEND_RECT_SIZE)
      .attr("class", "legend-item")
      .attr("fill", d => color(d));

    legendElem
      .append("text")
      .attr("class", "legend-text")
      .attr("x", LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
      .attr("y", LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
      .text(d => d);
  });

  function sumBySize(d) {
    return d.value;
  }
}

document.addEventListener("DOMContentLoaded", () => visualize());
