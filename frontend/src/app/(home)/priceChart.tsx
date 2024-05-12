import * as d3 from 'd3';

function drawPriceChart(data: any) {
  const svgWidth = 800, svgHeight = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const svg = d3.select('body').append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  x.domain(d3.extent(data, d => d.date));
  y.domain([0, d3.max(data, d => d.value)]);

  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', line);

  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  g.append('g')
    .call(d3.axisLeft(y));
}

const priceData = [
  { date: new Date('2021-01-01'), value: 5000 },
  { date: new Date('2021-02-01'), value: 5800 },
  { date: new Date('2021-03-01'), value: 5200 },
  { date: new Date('2021-04-01'), value: 6000 }
];

drawPriceChart(priceData);