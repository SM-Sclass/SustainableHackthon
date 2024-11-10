"use client"
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

function CarbonEmissionPage() {
    const [data, setData] = useState(null);
    const [currentGroup, setCurrentGroup] = useState(0);

    const productsPerGroup = 5;

    // Defining the numeric columns representing different emission sources
    const numericColumns = [
        "Land use change", "Animal Feed", "Farm", "Processing", "Transport", 
        "Packaging", "Retail"
    ];

    useEffect(() => {
        // Load CSV data
        d3.csv("/carbon/Food_Production.csv").then(rawData => {
            // Convert numeric values
            rawData.forEach(row => {
                numericColumns.forEach(col => {
                    row[col] = parseFloat(row[col]);
                });
            });

            setData(rawData);
        });
    }, []);

    if (!data) return <p>Loading data...</p>;

    // Grouping the data into sets of 5 products
    const groupedData = [];
    for (let i = 0; i < data.length; i += productsPerGroup) {
        groupedData.push(data.slice(i, i + productsPerGroup));
    }

    // Prepare the data for the stacked bar chart (total emissions broken down by source)
    const currentGroupData = groupedData[currentGroup];

    const barData = numericColumns.map(col => ({
        x: currentGroupData.map(d => d[col]),
        y: currentGroupData.map(d => d['Food product']),
        type: 'bar',
        orientation: 'h',
        name: col,
    }));

    // Prepare data for Pie Chart (Transport emissions grouped and filtered)
    const transportEmissions = data
        .map(d => ({ product: d['Food product'], transport: d['Transport'] }));

    // Summing Transport emissions by Food Product and applying the threshold
    const transportSeries = transportEmissions.reduce((acc, curr) => {
        acc[curr.product] = (acc[curr.product] || 0) + curr.transport;
        return acc;
    }, {});

    const transportArray = Object.entries(transportSeries);
    const threshold = transportArray.reduce((sum, [, value]) => sum + value, 0) / transportArray.length;
    const filteredTransport = transportArray.filter(([product, transport]) => transport > threshold);
    const otherTransport = transportArray.filter(([product, transport]) => transport <= threshold)
        .reduce((sum, [, value]) => sum + value, 0);

    if (otherTransport > 0) {
        filteredTransport.push(['Other', otherTransport]);
    }

    const pieData = {
        labels: filteredTransport.map(d => d[0]),
        values: filteredTransport.map(d => d[1]),
        type: 'pie',
    };

    return (
        <div className="w-full" style={{ paddingLeft: '5%', paddingRight: '5%', paddingTop: '160px' }}>
            {/* Title */}
            <h1 className="text-2xl font-bold mb-4 text-black">Carbon Emission Data</h1>
            
            {/* Stacked Bar Chart */}
            <div className="mb-8 w-full">
                <h2 className="text-xl font-semibold text-black pb-4">Greenhouse Gas Emissions by Food Product</h2>
                <Plot
                    data={barData}
                    layout={{
                        title: "Greenhouse Gas Emissions by Food Product and Source",
                        barmode: 'stack',
                        xaxis: { 
                            title: 'Emissions (kgCO₂eq)', 
                            automargin: true,
                        },
                        yaxis: { 
                            title: 'Food Product', 
                            automargin: true,
                        },
                        height: 600,  // Adjusted height for better visibility
                        margin: {
                            l: 50, r: 50, t: 50, b: 150  // Adjusted margins to avoid crowding
                        }
                    }}
                    style={{ width: '100%' }}  // Ensuring full width of the chart
                />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mb-4">
                <button
                    onClick={() => setCurrentGroup(Math.max(currentGroup - 1, 0))}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentGroup(Math.min(currentGroup + 1, groupedData.length - 1))}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Next
                </button>
            </div>

            {/* Pie Chart */}
            <div className="mb-8 w-full">
                <h2 className="text-xl font-semibold text-black">Food Distribution by Emissions via Transport</h2>
                <Plot
                    data={[pieData]}
                    layout={{
                        title: "Transport Emissions by Food Product",
                        showlegend: true,
                    }}
                    style={{ width: '100%' }}
                />
            </div>

        </div>
    );
}

export default CarbonEmissionPage;
