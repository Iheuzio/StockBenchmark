import React, { useState, useEffect } from 'react';
import './Chart.css';
import Plot from 'react-plotly.js';

function Chart({ tickers }) {
  // State hooks
  const [tickerData, setTickerData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [selectedTickerInfo, setSelectedTickerInfo] = useState(null);

  // Fetch data for all tickers when component mounts
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

  // Handle button click for individual ticker
  const handleTickerButtonClick = (ticker) => {
    setSelectedTicker(ticker);
    updateSelectedTickerInfo(ticker);
  };

  // Handle button click to show all tickers
  const handleShowAllButtonClick = () => {
    setSelectedTicker(null);
    setSelectedTickerInfo(null);
  };

  // Update selected ticker information
  const updateSelectedTickerInfo = (ticker) => {
    const tickerIndex = tickers.findIndex((t) => t.ticker === ticker);
    const selectedTickerData = tickerData[tickerIndex];

    if (selectedTickerData) {
      const adjustedCloseValues = getAdjustedCloseValues(selectedTickerData);
      const highestPrice = Math.max(...adjustedCloseValues);
      const lowestPrice = Math.min(...adjustedCloseValues);

      setSelectedTickerInfo({
        highestPrice,
        lowestPrice,
      });
    } else {
      setSelectedTickerInfo(null);
    }
  };

  // Prepare candlestick chart data
  const candlestickData = selectedTicker
    ? tickerData
        .filter((ticker) => ticker.ticker === selectedTicker)
        .map((ticker) => ({
          x: getCommonDates([ticker]),
          close: ticker.data.map((row) => row.close),
          high: ticker.data.map((row) => row.high),
          low: ticker.data.map((row) => row.low),
          open: ticker.data.map((row) => row.open),
          increasing: { line: { color: 'black' } },
          decreasing: { line: { color: 'red' } },
          type: 'candlestick',
          xaxis: 'x',
          yaxis: 'y',
          name: `Price Relative - ${ticker.ticker}`,
          visible: selectedTicker === null || selectedTicker === ticker.ticker,
        }))
    : tickerData.map((ticker) => ({
        x: getCommonDates(tickerData),
        close: ticker.data.map((row) => row.close),
        high: ticker.data.map((row) => row.high),
        low: ticker.data.map((row) => row.low),
        open: ticker.data.map((row) => row.open),
        increasing: { line: { color: 'black' } },
        decreasing: { line: { color: 'red' } },
        type: 'candlestick',
        xaxis: 'x',
        yaxis: 'y',
        name: `Price Relative - ${ticker.ticker}`,
        visible: selectedTicker === null || selectedTicker === ticker.ticker,
      }));

  // Layout for the candlestick chart
  const layout = {
    autosize: true,
    dragmode: 'zoom',
    width: Math.round(window.innerWidth * 1),
    height: Math.round(window.innerHeight * 0.9),
    title: `Stock Prices Comparison - ${selectedTicker || tickerData ? 'All Stocks' : 'No Stocks Added'}`,
    showlegend: false,
    xaxis: {
      autorange: true,
      title: 'Date',
      rangeselector: {
        x: 0,
        y: 1.2,
        xanchor: 'left',
        font: { size: 8 },
        buttons: [
          { step: 'month', stepmode: 'backward', count: 1, label: '1 month' },
          { step: 'month', stepmode: 'backward', count: 6, label: '6 months' },
          { step: 'all', label: 'All dates' },
        ],
      },
    },
    yaxis: {
      autorange: true,
    },
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
      <Plot data={candlestickData} layout={layout} />
      {selectedTickerInfo && (
        <div className="selected-ticker-info">
          <p>Highest Price: ${selectedTickerInfo.highestPrice.toFixed(2)}</p>
          <p>Lowest Price: ${selectedTickerInfo.lowestPrice.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
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
  if (ticker && ticker.data) {
    return ticker.data.map((row) => row.adjustedClose);
  } else {
    return [];
  }
};


export default Chart;
