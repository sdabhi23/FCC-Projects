var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

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

    var years = data.data.map((item) => {
        var quarter;
        var temp = item[0].substring(5, 7);
        
        if(temp === '01') {
            quarter = 'Q1';
        }
        else if (temp === '04'){
            quarter = 'Q2';
        }
        else if(temp === '07') {
            quarter = 'Q3';
        }
        else if(temp ==='10') {
            quarter = 'Q4';
        }
    
        return item[0].substring(0, 4) + ' ' + quarter
    });

    var yearsDigits = years.map((item) => item.substring(0, 4));

    var xScale = d3.scaleLinear().domain([d3.min(yearsDigits), d3.max(yearsDigits)]).range([0, w]);

    var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));

    var xAxisGroup = svg.append('g').call(xAxis).attr('id', 'x-axis').attr('transform', 'translate(60, 400)');

    var GDP = data.data.map((item) => item[1]);

    var scaledGDP = [];

    var gdpMin = d3.min(GDP);
    var gdpMax = d3.max(GDP);

    var linearScale = d3.scaleLinear().domain([gdpMin, gdpMax]).range([(gdpMin/gdpMax) * h, h]);

    scaledGDP = GDP.map((item) => linearScale(item));

    var yAxisScale = d3.scaleLinear().domain([gdpMin, gdpMax]).range([h, (gdpMin/gdpMax) * h]);

    var yAxis = d3.axisLeft(yAxisScale)

    var yAxisGroup = svg.append('g').call(yAxis).attr('id', 'y-axis').attr('transform', 'translate(60, 0)');

    var tooltip = d3.select("#graphArea")
                    .append("div")
                    .attr("class", "d3-tip")
                    .attr("id", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .text("a simple tooltip");
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -200)
        .attr('y', 80)
        .text('Gross Domestic Product')
        .style('font-family', "'Nunito', sans-serif");
  
    svg.append('text')
        .attr('x', w/2 + 120)
        .attr('y', h + 50)
        .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
        .style('font-family', "'Nunito', sans-serif");

    svg.selectAll('rect')
        .data(scaledGDP)
        .enter()
        .append('rect')
        .attr('data-date', (d, i) => data.data[i][0])
        .attr('data-gdp', (d, i) => data.data[i][1])
        .attr('class', 'bar')
        .attr('x', (d, i) => i * barWidth)
        .attr('y', (d, i) => h - d)
        .attr('width', barWidth)
        .attr('height', (d) => d)
        .style('fill', 'orange')
        .attr('transform', 'translate(60, 0)')
        .on('mouseover', (d, i) => {
            tooltip.style("visibility", "visible")
                    .style('left', (i * barWidth) + 100 + 'px')
                    .style('top', h - d + 30 + 'px')
                    .style('transform', 'translateX(60px)')
                    .attr('data-date', data.data[i][0])
                    .html("<strong>" + years[i] + ":</strong> <span style='color:lightblue'>$" + GDP[i] + " billion</span>");
        })
        .on('mouseout', () => tooltip.style("visibility", "hidden"));
}

document.addEventListener('DOMContentLoaded', () => {
    getData();
});