var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

function getData() {
    var req=new XMLHttpRequest();
    req.open("GET",url,true);
    req.send();
    req.onload=() => {
        json = JSON.parse(req.responseText);
        visualize(json);
    };    
}

function visualize(data) {
    
    var yMargin = 40, w = 800, h = 400, barWidth = w/275;
    
    console.log(data);

    const svg = d3.select("#graphArea").append("svg").attr("width", w + 100).attr("height", h + 60);

    var x = d3.scaleLinear().range([0, w]);
    var y = d3.scaleTime().range([0, h]);
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var timeParse = d3.timeParse("%M:%S");
    var timeFormat = d3.timeFormat("%M:%S");
    var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
    var yAxis = d3.axisLeft(y).tickFormat(timeFormat);

    data.forEach((d) => d.Time = timeParse(d.Time));

    var yAxisGroup = svg.append('g').call(yAxis).attr('id', 'y-axis').attr('transform', 'translate(60, 0)');

    var tooltip = d3.select("#graphArea")
                    .append("div")
                    .attr("class", "d3-tip")
                    .attr("id", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .text("a simple tooltip");
    
    x.domain([d3.min(data,(d) => d.Year - 1), d3.max(data,(d) => d.Year + 1)]);

    y.domain(d3.extent(data,(d) => d.Time));
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("id","x-axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Year");
    
    svg.append("g")
        .attr("class", "y axis")
        .attr("id","y-axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Best Time (minutes)")
        
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -160)
        .attr('y', -44)
        .style('font-size', 18)
        .text('Time in Minutes')
        .style('font-family', "'Nunito', sans-serif");

    // svg.selectAll('rect')
    //     .data(scaledGDP)
    //     .enter()
    //     .append('rect')
    //     .attr('data-date', (d, i) => data.data[i][0])
    //     .attr('data-gdp', (d, i) => data.data[i][1])
    //     .attr('class', 'bar')
    //     .attr('x', (d, i) => i * barWidth)
    //     .attr('y', (d, i) => h - d)
    //     .attr('width', barWidth)
    //     .attr('height', (d) => d)
    //     .style('fill', 'orange')
    //     .attr('transform', 'translate(60, 0)')
    //     .on('mouseover', (d, i) => {
    //         tooltip.style("visibility", "visible")
    //                 .style('left', (i * barWidth) + 100 + 'px')
    //                 .style('top', h - d + 30 + 'px')
    //                 .style('transform', 'translateX(60px)')
    //                 .attr('data-date', data.data[i][0])
    //                 .html("<strong>" + years[i] + ":</strong> <span style='color:lightblue'>$" + GDP[i] + " billion</span>");
    //     })
    //     .on('mouseout', () => tooltip.style("visibility", "hidden"));
}

document.addEventListener('DOMContentLoaded', () => {
    getData();
});