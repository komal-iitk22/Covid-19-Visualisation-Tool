import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const OneLineGraph = ({ casesType }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://disease.sh/v3/covid-19/historical/all?lastdays=30`);
      const data = await response.json();
      const chartData = [];

      for (let date in data[casesType]) {
        chartData.push({
          x: date,
          y: data[casesType][date],
        });
      }

      setData(chartData);
    };

    fetchData();
  }, [casesType]);

  return (
    <Plot
      data={[
        {
          x: data.map((d) => d.x),
          y: data.map((d) => d.y),
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "#FF5722" },
        },
      ]}
      layout={{
        title: `${casesType.toUpperCase()} over the last 30 days`,
        xaxis: { tickfont: { size: 10 },nticks: 10, },
        yaxis: {
          tickfont: { size: 10},
          
        },
        height: 200,
        width: 350,
        margin: { l: 40, r: 20, t: 30, b: 40 },
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default OneLineGraph;
