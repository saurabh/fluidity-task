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

export const PriceChart: React.FC<DepthChartProps> = ({ data }) => {
    console.log('data', data)
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (data.length === 0) return;


    const svgWidth = 800, svgHeight = 800;
    const margin = { top: 50, right: 30, bottom: 30, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Clear previous SVG
    d3.select(ref.current).selectAll("*").remove();

    // Create SVG container
    const svg = d3.select(ref.current)
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up the scales
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp))) // Use the newly added timestamp
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([height, 0]);

    // Define the line
    const line = d3.line<ApiResponse & { timestamp: number }>()
      .x(d => x(new Date(d.timestamp)))
      .y(d => y(d.price))
      .curve(d3.curveMonotoneX); // This makes the line smoother

    // Add the line path
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Add the X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
      .call(d3.axisLeft(y));

  }, [data]);

  return <svg ref={ref} />;
};