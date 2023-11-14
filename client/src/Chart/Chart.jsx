import React, { useState } from 'react';
import './Chart.css';
import Plot from 'react-plotly.js';
import { useEffect } from 'react';

/**
 * A component that displays a chart comparing the stock prices of multiple tickers.
 * @param {Object} props - The component props.
 * @param {string[]} props.tickers - An array of ticker symbols to compare.
 * @returns {JSX.Element} - The Chart component.
 */
function Chart({ tickers }) {
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    const fetchData = async (ticker) => {
      const res = await fetch(`/tickers/${ticker}`);
      const json = await res.json();
      return json;
    };

    const fetchAllTickers = async () => {
      tickers.forEach(async (ticker) => {
        const isOldTicker = (tickerData.filter((oldTicker) => oldTicker.ticker === ticker.ticker).length > 0);
        if (!isOldTicker) {
          const data = await fetchData(ticker.ticker);
          setTickerData((oldTicker) => [...oldTicker, data])
        }
      })
    };

    fetchAllTickers();
  }, [tickers]);

  if (tickerData) {
    let plotData = []
    if (tickerData.length > 0) {
      const commonDates = getCommonDates(tickerData);
  
      // plot the data
      plotData = tickerData.map((ticker) => {
        const adjustedCloseValues = getAdjustedCloseValues(ticker);
        const relativePrices = adjustedCloseValues.map((value) => value / adjustedCloseValues[0]);
        const trace = {
          x: commonDates,
          y: relativePrices,
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: ticker.color },
          name: `Price Relative - ${ticker.ticker}`,
        };
  
        return trace;
      });
    }

    // plot layout
    const layout = {
      width: 1200,
      height: 600,
      title: `Stock Prices Comparison`,
      updatemenus: [
        {
          x: 0.1,
          y: 1.15,
          xref: 'paper',
          yref: 'paper',
          showactive: false,
          buttons: [
            {
              method: 'relayout',
              args: ['showlegend', true],
              label: 'Show Legend',
            },
            {
              method: 'relayout',
              args: ['showlegend', false],
              label: 'Hide Legend',
            },
          ],
        },
      ],
    };

    return (
      <div className="chart">
        <Plot data={plotData} layout={layout} />
      </div>
    );
  }

  return null;
}


/**
 * Returns an array of common dates from an array of ticker data.
 * @param {Array} tickerData - An array of ticker data.
 * @returns {Array} An array of common dates.
 */
const getCommonDates = (tickerData) => {
  const dates = tickerData.map((ticker) => ticker.data.map((row) => row.timestamp));
  const intersection = dates.reduce((acc, curr) => acc.filter((date) => curr.includes(date)));
  return Array.from(new Set(intersection.flat()));
};

/**
 * Returns an array of adjusted close values for a given ticker.
 * @param {Object} ticker - The ticker object containing data for a stock.
 * @returns {Array} An array of adjusted close values.
 */
const getAdjustedCloseValues = (ticker) => {
  return ticker.data.map((row) => row.adjustedClose);
};

export default Chart;
