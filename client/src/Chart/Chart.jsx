import React, { useState, useEffect, useMemo } from 'react';
import './Chart.css';
import Plot from 'react-plotly.js';

function Chart({ tickers }) {
  const [tickerData, setTickerData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [selectedTickerInfo, setSelectedTickerInfo] = useState(null);
  const [error, setError] = useState(null);
  const colorScale = ['#1f77b4', '#bcbd22', '#2ca02c', '#7f7f7f', '#9467bd', '#e377c2', '#8c564b', '#d62728', '#ff7f0e', '#17becf'];

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

  const handleTickerButtonClick = (ticker) => {
    setSelectedTicker(ticker);
    updateSelectedTickerInfo(ticker);
  };

  const handleShowAllButtonClick = () => {
    setSelectedTicker(null);
    setSelectedTickerInfo(null);
  };

  const updateSelectedTickerInfo = (ticker) => {
    const selectedTickerData = tickerData.find((t) => t.ticker === ticker);

    if (selectedTickerData) {
      const highestHigh = Math.max(...selectedTickerData.data.map((row) => row.high));
      const lowestLow = Math.min(...selectedTickerData.data.map((row) => row.low));
      const highestHighIndex = selectedTickerData.data.findIndex((row) => row.high === highestHigh);
      const lowestLowIndex = selectedTickerData.data.findIndex((row) => row.low === lowestLow);
      const dates = selectedTickerData.data.map((row) => row.timestamp);
      const highestHighDate = dates[highestHighIndex];
      const lowestLowDate = dates[lowestLowIndex];

      setSelectedTickerInfo({
        highestValue: highestHigh,
        highestValueDate: highestHighDate,
        lowestValue: lowestLow,
        lowestValueDate: lowestLowDate,
      });
    } else {
      setSelectedTickerInfo(null);
    }
  };

  const candlestickData = useMemo(() => {
    // check if selectedTicker then only show that ticker
    // otherwise show all tickers
    if(selectedTicker) {
      const selectedTickerData = tickerData.filter((ticker) => ticker.ticker === selectedTicker);
      return selectedTickerData.map((ticker) => {
        const commonDates = getCommonDates(selectedTickerData);
        const candlestick = {
          x: commonDates,
          close: ticker.data.map((row) => row.close),
          high: ticker.data.map((row) => row.high),
          low: ticker.data.map((row) => row.low),
          open: ticker.data.map((row) => (row.open === 0 ? row.low : row.open)),
          increasing: { line: { color: 'green' } },
          decreasing: { line: { color: 'red' } },
          type: 'candlestick',
          xaxis: 'x',
          yaxis: 'y',
          name: `${ticker.ticker}`,
        };
  
        return candlestick;
      });
    }
    return tickerData.map((ticker, index) => {
      const commonDates = getCommonDates(tickerData);
      const candlestick = {
        x: commonDates,
        close: ticker.data.map((row) => row.close),
        high: ticker.data.map((row) => row.high),
        low: ticker.data.map((row) => row.low),
        open: ticker.data.map((row) => (row.open === 0 ? row.low : row.open)),
        increasing: { line: { color: colorScale[index % colorScale.length] } },
        decreasing: { line: { color: colorScale.reverse()[index % colorScale.length] } },
        type: 'candlestick',
        xaxis: 'x',
        yaxis: 'y',
        name: `${ticker.ticker}`,
      };

      return candlestick;
    });
  }, [tickerData, selectedTicker]);

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
        xanchor: 'free',
        yanchor: 'bottom',
        bgcolor: 'black',
        bordercolor: 'white',
        borderwidth: 1,
        font: { size: 8, color: 'white' },
        buttonsize: 20,
        buttons: [
          { step: 'day', stepmode: 'backward', count: 7, label: '1 week', color: 'white', active: true },
          { step: 'day', stepmode: 'backward', count: 14, label: '2 weeks', color: 'white' },
          { step: 'day', stepmode: 'backward', count: 30, label: '1 month', color: 'white' },
          { step: 'day', stepmode: 'backward', count: 90, label: '3 months', color: 'white' },
          { step: 'day', stepmode: 'backward', count: 180, label: '6 months', color: 'white' },
          { step: 'all', label: 'All dates', color: 'white' },
        ],

      },
      rangeslider: {
        visible: true,
      },
      rangeslider_thickness: 0.1,
    },
    yaxis: {
      autorange: true,
      color: 'white',
      title: 'Price',
      titlefont: {
        size: 18,
        color: 'white',
        family: 'Arial, sans-serif',
        fontWeight: 700,
      },
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
    legend: {
      x: 0,
      y: 1,
      xanchor: 'free',
      yanchor: 'free',
      orientation: 'v',
      bgcolor: 'black',
      bordercolor: 'white',
      borderwidth: 1,
      font: {
        family: 'Arial, sans-serif',
        size: 12,
        color: 'white',
      },
    },
  };

  if (selectedTickerInfo) {
    const highestValueAnnotation = {
      x: selectedTickerInfo.highestValueDate,
      y: selectedTickerInfo.highestValue,
      xref: 'x',
      yref: 'y',
      text: `Highest Value: $${selectedTickerInfo.highestValue.toFixed(2)}`,
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

    const lowestValueAnnotation = {
      x: selectedTickerInfo.lowestValueDate,
      y: selectedTickerInfo.lowestValue,
      xref: 'x',
      yref: 'y',
      text: `Lowest Value: $${selectedTickerInfo.lowestValue.toFixed(2)}`,
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

    layout.annotations.push(highestValueAnnotation);
    layout.annotations.push(lowestValueAnnotation);
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
          <Plot data={candlestickData} layout={layout} config={{ displayModeBar: false }} />
          {selectedTickerInfo && (
            <div className="selected-ticker-info">
              <p>Highest Value: ${selectedTickerInfo.highestValue.toFixed(2)}</p>
              <p>Lowest Value: ${selectedTickerInfo.lowestValue.toFixed(2)}</p>
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

export default Chart;
