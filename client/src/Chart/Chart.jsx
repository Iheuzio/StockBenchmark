import React, { useState, useEffect } from 'react';
import './Chart.css';
import Plot from 'react-plotly.js';

function Chart({ tickers }) {
  // State hooks
  const [tickerData, setTickerData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [selectedTickerInfo, setSelectedTickerInfo] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data for all tickers when component mounts
  useEffect(() => {
    const fetchData = async (ticker) => {
      try {
        const res = await fetch(`/tickers/${ticker}`);
        const json = await res.json();
        return json;
      } catch (error) {
        setError(`Error fetching data for ${ticker}: ${error.message}`);
        return null;
      }
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
      const highestPriceIndex = adjustedCloseValues.indexOf(highestPrice);
      const lowestPriceIndex = adjustedCloseValues.indexOf(lowestPrice);
      const dates = selectedTickerData.data.map((row) => row.timestamp);
      const highestPriceDate = dates[highestPriceIndex];
      const lowestPriceDate = dates[lowestPriceIndex];

      setSelectedTickerInfo({
        highestPrice,
        highestPriceDate,
        lowestPrice,
        lowestPriceDate,
      });
    } else {
      setSelectedTickerInfo(null);
    }
  };

  // Prepare candlestick chart data
  const candlestickData = selectedTicker === null
    ? tickerData
        .filter((ticker) => ticker.ticker === selectedTicker)
        .map((ticker) => ({
          x: getCommonDates([ticker]),
          close: ticker.data.map((row) => row.close),
          high: ticker.data.map((row) => row.high),
          low: ticker.data.map((row) => row.low),
          open: ticker.data.map((row) => row.open),
          increasing: { line: { color: 'green' } },
          decreasing: { line: { color: 'red' } },
          type: 'candlestick',
          xaxis: 'x',
          yaxis: 'y',
          name: `${ticker.ticker}`,
          visible: selectedTicker === null || selectedTicker === ticker.ticker,
        }))
    : tickerData.map((ticker) => ({
        x: getCommonDates(tickerData),
        close: ticker.data.map((row) => row.close),
        high: ticker.data.map((row) => row.high),
        low: ticker.data.map((row) => row.low),
        open: ticker.data.map((row) => row.open),
        increasing: { line: { color: ticker.color } },
        decreasing: { line: { color: `hsl(${(ticker.color + 180) % 360}, 100%, 50%)` } },
        type: 'candlestick',
        xaxis: 'x',
        yaxis: 'y',
        name: `${ticker.ticker}`,
        visible: selectedTicker === null || selectedTicker === ticker.ticker,
      }));

  const layout = {
    autosize: true,
    dragmode: 'zoom',
    width: Math.round(window.innerWidth * 1),
    height: Math.round(window.innerHeight * 0.9),
    title: {
      text: `${selectedTicker === null ? (tickerData.length === 0 ? 'No Stocks Added' : 'All Stocks') : selectedTicker}`,
      font: {
        family: 'Arial, sans-serif',
        size: 24,
        fontWeight: 700,
        color: 'white',
      },
    },
    xaxis: {
      autorange: true,
      title: 'Date',
      titlefont: {
        size: 18,
        color: 'white',
        family: 'Arial, sans-serif',
        fontWeight: 700,
      },
      tickfont: {
        size: 12,
        color: 'white',
      },
      rangeselector: {
        x: 0,
        y: 1.2,
        xanchor: 'left',
        font: { size: 8 },
        buttons: [
          { step: 'day', stepmode: 'backward', count: 7, label: '1 week' }, 
          { step: 'day', stepmode: 'backward', count: 14, label: '2 weeks' }, 
          { step: 'all', label: 'All dates' },
        ],
      },
      tickangle: 'horizontal',
    },
    yaxis: {
      autorange: true,
    },
    margin: {
      l: 80,
      r: 80,
      t: 100,
      b: 80,
    },
    paper_bgcolor: 'black',
    plot_bgcolor: 'black',
    annotations: [], 
  };

  const config = {
    displayModeBar: false,
  };

  // Add annotations for highest and lowest prices
  if (selectedTickerInfo) {
    const highestPriceAnnotation = {
      x: selectedTickerInfo.highestPriceDate,
      y: selectedTickerInfo.highestPrice,
      xref: 'x',
      yref: 'y',
      text: `Highest Price: $${selectedTickerInfo.highestPrice.toFixed(2)}`,
      showarrow: true,
      arrowhead: 7,
      ax: 0,
      ay: -40,
      font: {
        family: 'Arial, sans-serif',
        size: 14,
        color: 'white',
      },
    };

    const lowestPriceAnnotation = {
      x: selectedTickerInfo.lowestPriceDate,
      y: selectedTickerInfo.lowestPrice,
      xref: 'x',
      yref: 'y',
      text: `Lowest Price: $${selectedTickerInfo.lowestPrice.toFixed(2)}`,
      showarrow: true,
      arrowhead: 7,
      ax: 0,
      ay: -20,
      font: {
        family: 'Arial, sans-serif',
        size: 14,
        color: 'white',
      },
    };

    layout.annotations.push(highestPriceAnnotation);
    layout.annotations.push(lowestPriceAnnotation);
  }

  return (
    <div className="chart">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && (
        <>
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
          <Plot data={candlestickData} layout={layout} config={config} />
          {selectedTickerInfo && (
            <div className="selected-ticker-info">
              <p>Highest Price: ${selectedTickerInfo.highestPrice.toFixed(2)}</p>
              <p>Lowest Price: ${selectedTickerInfo.lowestPrice.toFixed(2)}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Utility functions
const getCommonDates = (tickerData) => {
  const dates = tickerData.map((ticker) => ticker.data.map((row) => row.timestamp));
  const intersection = dates.reduce((acc, curr) => acc.filter((date) => curr.includes(date)));
  return Array.from(new Set(intersection.flat()));
};

const getAdjustedCloseValues = (ticker) => {
  if (ticker && ticker.data) {
    return ticker.data.map((row) => row.close);
  } else {
    return [];
  }
};

export default Chart;
