import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CountryChart = ({ countryCode }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      let response;
      let data;

      if (countryCode === 'worldwide') {
        response = await fetch('https://disease.sh/v3/covid-19/all');
        data = await response.json();
      } else {
        response = await fetch(`https://disease.sh/v3/covid-19/countries/${countryCode}`);
        data = await response.json();
      }

      const { cases, deaths, recovered } = data;

      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 500 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      const x = d3
        .scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(['Confirmed', 'Deaths', 'Recovered']);

      const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max([cases, deaths, recovered])]).nice(5);

      const colorScale = d3.scaleOrdinal()
        .domain(['Confirmed', 'Deaths', 'Recovered'])
        .range(['#fcbba1', '#fb6a4a', '#a1d99b']);

      const chart = d3.select(chartRef.current);

      chart.selectAll('*').remove();

      chart
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .selectAll('.bar')
        .data([cases, deaths, recovered])
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => x(['Confirmed', 'Deaths', 'Recovered'][i]))
        .attr('y', d => y(d))
        .attr('height', d => height - y(d))
        .attr('width', x.bandwidth())
        .attr('fill', (d, i) => colorScale(['Confirmed', 'Deaths', 'Recovered'][i]))
        .append('title')
        .text(d => d3.format('.2f')(d / 1000000) + 'M'); // format the number as millions with one decimal place

      chart
        .append('g')
        .attr('transform', `translate(${margin.left},${height + margin.top})`)
        .call(d3.axisBottom(x));

      chart
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));
    };

    fetchData();
  }, [countryCode]);

  return (<>
  <svg ref={chartRef} width={500} height={300} className="country-chart" />
  <h4 style={{'text-align':'center'}}>{countryCode} Covid 19 Details</h4></>);
};

export default CountryChart;
