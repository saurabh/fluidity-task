import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ApiResponse {
  price: number;
  amount: number;
  side: 'bid' | 'ask';
}

interface DepthChartProps {
  data: ApiResponse[];
}

export const DepthChart: React.FC<DepthChartProps> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.length === 0) return;

    const asks = data.filter(d => d.side === 'ask').sort((a, b) => b.price - a.price).slice(0, 7);
    const bids = data.filter(d => d.side === 'bid').sort((a, b) => b.price - a.price).slice(0, 7);
    const combinedData = [...bids, ...asks];

    const svgWidth = 350, svgHeight = 800;
    const margin = { top: 50, right: 50, bottom: 30, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Clear previous SVG
    d3.select(ref.current).selectAll("*").remove();

    // Create SVG container
    const svg = d3.select(ref.current).append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up the scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(combinedData, d => d.amount)])
      .range([0, width]);

      
    const yAsks = d3.scaleBand()
      .domain(asks.map(d => d.price.toString()))
      .range([height / 2, 0])
      .padding(0.1);

    const yBids = d3.scaleBand()
      .domain(bids.map(d => d.price.toString()))
      .range([height / 2, height])
      .padding(0.1);


    // Create bars for the data
    svg.selectAll('.bar.ask')
      .data(asks)
      .enter().append('rect')
      .attr('class', 'bar ask')
      .attr('x', 0)
      .attr('y', d => yAsks(d.price.toString()))
      .attr('width', d => x(d.amount))
      .attr('height', yAsks.bandwidth())
      .attr('fill', 'red');

    svg.selectAll('.bar.bid')
      .data(bids)
      .enter().append('rect')
      .attr('class', 'bar bid')
      .attr('x', 0)
      .attr('y', d => yBids(d.price.toString()))
      .attr('width', d => x(d.amount))
      .attr('height', yBids.bandwidth())
      .attr('fill', 'green');


    svg.append('g')
      .call(d3.axisLeft(yAsks));
    // Add the Y Axes for bids
    svg.append('g')
      .call(d3.axisLeft(yBids));

    // Add the X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

  }, [data]);

  return <div ref={ref} />;
};