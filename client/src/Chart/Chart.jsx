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
  const [selectedTickerInfo, setSelectedTickerInfo] = useState(null);

  useEffect(() => {
    const fetchData = async (ticker) => {
      const res = await fetch(`/tickers/${ticker}`, {cache: 'no-cache'});
      const json = await res.json();
      return json;
    };

    const fetchAllTickers = async () => {
      let tickersName = tickers.map((tick) => tick.ticker);
      let newTickersName = [];
      tickersName.forEach((tick) => {
        if (tickerData.filter((data) => data.ticker === tick).length < 1) {
          newTickersName = [...newTickersName, tick]
        }
      })
      const data = await Promise.all(newTickersName.map((ticker) => fetchData(ticker)));
      setTickerData((old) => old.concat(data));
    };    

    fetchAllTickers();
    // Disable because I need to check old data to only fetch new data
    // else the useEffect would trigger twice for nothing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // Handle the case where selectedTickerData is not found
      setSelectedTickerInfo(null);
    }
  };

  if (tickerData) {
    let plotData = [];
  
    if (tickerData.length > 0) {
      const commonDates = getCommonDates(tickerData);
  
      // Plot data for each selected stock
      plotData = tickers.map((ticker, index) => {
        const adjustedCloseValues = getAdjustedCloseValues(tickerData[index]);
  
        if (adjustedCloseValues.length > 0) {
          const relativePrices = adjustedCloseValues.map((value) => value / adjustedCloseValues[0]);
  
          return {
            x: commonDates,
            y: relativePrices,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: tickerData[index].color },
            name: `Price Relative - ${ticker.ticker}`,
            visible: selectedTicker === null || selectedTicker === ticker.ticker,
          };
        }
  
        // Handle the case where adjustedCloseValues is empty
        return null;
      }).filter(Boolean); // Filter out null values
    } else {
      // Default trace for an empty chart
      plotData.push({
        x: [/* provide default x values */],
        y: [/* provide default y values */],
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: '#AAA' },  // or any default color you want
        name: 'No Data Available',
      });
    }

    const layout = {
      autosize: true,
      width: Math.round(window.innerWidth * 1),
      height: Math.round(window.innerHeight * 0.9),
      title: `Stock Prices Comparison - ${selectedTicker || 'All Stocks'}`,
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
  if (ticker && ticker.data) {
    return ticker.data.map((row) => row.adjustedClose);
  } else {
    return [];
  }
};


export default Chart;
