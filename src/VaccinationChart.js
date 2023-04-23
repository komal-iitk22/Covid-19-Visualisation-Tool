import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const VaccinationChart = ({ countryCode }) => {
    const [vaccineData, setVaccineData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            let url;
            if (countryCode === 'worldwide') {
                url = 'https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=30';
            } else {
                url = `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}?lastdays=30`;
            }

            try {
                const response = await axios.get(url);
                const data = response.data;
                setVaccineData(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [countryCode]);

    if (!vaccineData) {
        return <div>Loading...</div>;
    }

    let x = [];
    let y = [];
    let text = [];

    if (countryCode === 'worldwide') {
        Object.entries(vaccineData).forEach(([date, value]) => {
            x.push(date);
            y.push(value);
            text.push(`Date: ${date}<br>Vaccinations: ${value}`);
        });
    } else {
        Object.entries(vaccineData.timeline).forEach(([date, value]) => {
            x.push(date);
            y.push(value);
            text.push(`Date: ${date}<br>Vaccinations: ${value}`);
        });
    }

    const data = [
        {
            x: x,
            y: y,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' },
            text: text,
            hoverinfo: 'text',
        },
    ];

    const layout = {
        title: `Vaccinations for ${countryCode}`,
        xaxis: {
            title: 'Date',
        },
        yaxis: {
            title: 'Vaccinations',
            tickformat: ".6s", 
        },
        height: 320,
        width: 600,
       
    };

    return (
        <div>
            <Plot data={data} layout={layout} />
        </div>
    );
};

export default VaccinationChart;
