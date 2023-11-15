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
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [selectedTickerInfo, setSelectedTickerInfo] = useState(null);

  useEffect(() => {
    const fetchData = async (ticker) => {
      const res = await fetch(`/tickers/${ticker}`);
      const json = await res.json();
      return json;
    };

    const fetchAllTickers = async () => {
      const data = await Promise.all(tickers.map((ticker) => fetchData(ticker.ticker)));
      setTickerData(data);
    };

    fetchAllTickers();
  }, [tickers]);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth * 0.9;
      setChartWidth(newWidth);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleTickerButtonClick = (ticker) => {
    setSelectedTicker(ticker);
    updateSelectedTickerInfo(ticker);
  };

  const handleShowAllButtonClick = () => {
    setSelectedTicker(null);
    setSelectedTickerInfo(null);
  };

  const updateSelectedTickerInfo = (ticker) => {
    const selectedTickerData = tickerData.find((data) => data.ticker === ticker);
    const adjustedCloseValues = getAdjustedCloseValues(selectedTickerData);
    const highestPrice = Math.max(...adjustedCloseValues);
    const lowestPrice = Math.min(...adjustedCloseValues);

    setSelectedTickerInfo({
      highestPrice,
      lowestPrice,
    });
  };
  
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

    const layout = {
      autosize: true,
      width: Math.round(window.innerWidth * 1),
      height: Math.round(window.innerHeight * 0.9),
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
        <div className="button-container">
          <button onClick={handleShowAllButtonClick} className={selectedTicker === null ? 'active' : ''}>
            Show All
          </button>
          {tickers.map((ticker) => (
            <button
              key={ticker.ticker}
              onClick={() => handleTickerButtonClick(ticker.ticker)}
              className={selectedTicker === ticker.ticker ? 'active' : ''}
            >
              {ticker.ticker}
            </button>
          ))}
        </div>
        <Plot data={plotData} layout={layout} />
        {selectedTickerInfo && (
          <div className="selected-ticker-info">
            <p>Highest Price: ${selectedTickerInfo.highestPrice.toFixed(2)}</p>
            <p>Lowest Price: ${selectedTickerInfo.lowestPrice.toFixed(2)}</p>
          </div>
        )}
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
