import React, { useState, useEffect } from 'react';
import './Chart.css';
import Plot from 'react-plotly.js';
import useSWR from 'swr';

/**
 * Component that displays the chart
 * @param {Object[]} tickers - List of ticker Object that are currently displayed
 * @returns {JSX.Element} - The Chart component.
 * @example
 * <Chart tickers={"RE"} />
 * 
 */
function Chart({ tickers }) {
  const [tickerData, setTickerData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [selectedTickerInfo, setSelectedTickerInfo] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {

    /**
     * Fetch month data for a ticker
     * @param {string} ticker - The ticker to fetch data for
     * @returns {Object} - The month data for the ticker
    */
    const fetchData = async (ticker) => {
      try {
        const requestUrl = `/tickers/month/${ticker}`;
        const res = await fetch(requestUrl, { cache: "force-cache"});
        const json = await res.json();
        json.color = tickers.find((t) => t.ticker === ticker).color;
        return json;
      } catch (error) {
        setError(`Error fetching data for ${ticker}: ${error.message}`);
        return null;
      }
    };

    /**
      * Fetch full data for a ticker
      * @param {string} ticker - The ticker to fetch data for
      * @returns {Object} - The full data for the ticker
      * @example
      * const fullData = await fetchFullData("RE");
      * console.log(fullData);
      * // {
      * //   ticker: "RE",
      * //   data: [
      * //     {
      * //       timestamp: "01-01-2021",
      * //       open: 0,
      * //       high: 0,
      * //       low: 0,
      * //       close: 0,
      * //       volume: 0,
      * //     },
      * //     ...
      * //   ],
      * //   color: "#000000",
      * // }
     */
    const fetchFullData = async (ticker) => {
      try {
        const requestUrl = `/tickers/${ticker}`;
        const res = await fetch(requestUrl, { cache: "force-cache"});
        const json = await res.json();
        json.color = tickers.find((t) => t.ticker === ticker).color;
        return json;
      } catch (error) {
        setError(`Error fetching full data for ${ticker}: ${error.message}`);
        return null;
      }
    };

    /**
     * Fetch all tickers data
     * @returns {Object[]} - The data for all tickers
     */
    const fetchAllTickers = async () => {
      const monthData = await Promise.all(tickers.map((ticker) => fetchData(ticker.ticker)));
      setTickerData(monthData);

      const fullData = await Promise.all(tickers.map((ticker) => fetchFullData(ticker.ticker)));
      setTickerData(fullData);
    };

    fetchAllTickers();
  }, [tickers]);

  /**
   * Handle ticker button click
   * @param {string} ticker - The ticker to fetch data for
   * @returns {void}
   * @example
   * <button onClick={() => handleTickerButtonClick("RE")}>RE</button>
   * // Sets selectedTicker to "RE"
   * // Sets selectedTickerInfo to {
   * //   highestValue: 0,
   * //   highestValueDate: "01-01-2021",
   * //   lowestValue: 0,
   * //   lowestValueDate: "01-01-2021",
   * // }
   */
  const handleTickerButtonClick = (ticker) => {
    setSelectedTicker(ticker);
    updateSelectedTickerInfo(ticker);
  };

  /**
   * Handle show all button click
   * @returns {void}
   * @example
   * <button onClick={handleShowAllButtonClick}>Show All</button>
   * // Sets selectedTicker to null
   * // Sets selectedTickerInfo to null
   * // Sets layout.title.text to "All Stocks"
   * // Sets layout.annotations to []
   */
  const handleShowAllButtonClick = () => {
    setSelectedTicker(null);
    setSelectedTickerInfo(null);
  };

  /**
   * Update selected ticker info
   * @param {string} ticker - The ticker to fetch data for
   * @returns {void}
   * @example
   * updateSelectedTickerInfo("RE");
   */
  const updateSelectedTickerInfo = (ticker) => {
    const selectedTickerData = tickerData.find((t) => t.ticker === ticker);

    if (selectedTickerData) {
      const formattedDates = selectedTickerData.data.map((row) => {
        const [day, month, year] = row.timestamp.split('-');
        return new Date(`${month}-${day}-${year}`);
      });

      const highestHigh = Math.max(...selectedTickerData.data.map((row) => row.high));
      const lowestLow = Math.min(...selectedTickerData.data.map((row) => row.low));
      const highestHighIndex = selectedTickerData.data.findIndex((row) => row.high === highestHigh);
      const lowestLowIndex = selectedTickerData.data.findIndex((row) => row.low === lowestLow);
      const highestHighDate = formattedDates[highestHighIndex];
      const lowestLowDate = formattedDates[lowestLowIndex];

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

  /**
   * Fetch month data for a ticker
   * @param {string} ticker - The ticker to fetch data for
   * @returns {Object} - The month data for the ticker
   * @example
   * const monthData = await fetchData("RE");
   */
  const { data: candlestickData } = useSWR([tickerData, selectedTicker], () => {
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
    return tickerData.map((ticker) => {
      const commonDates = getCommonDates(tickerData);

      /**
       * Candlestick data for a ticker to be displayed on the chart
       * @type {Object}
       */
      const candlestick = {
        x: commonDates,
        close: ticker.data.map((row) => row.close),
        high: ticker.data.map((row) => row.high),
        low: ticker.data.map((row) => row.low),
        open: ticker.data.map((row) => (row.open === 0 ? row.low : row.open)),
        increasing: { line: { color: ticker.color} },
        decreasing: { line: { color: '#' + (0xffffff - parseInt(ticker.color?.substring(1), 16)).toString(16) } },
        type: 'candlestick',
        xaxis: 'x',
        yaxis: 'y',
        name: `${ticker.ticker}`,
      };

      return candlestick;
    });
  });

  /**
   * Layout for the chart, displays candle stick data
   * @type {Object}
   */
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
      type:'date',
      tickformat: '%d-%m-%Y'
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
    // if selectedTickerInfo is not null, add annotations
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
          <Plot data={candlestickData} layout={layout} config={{ displayModeBar: false, useWebGL: true }} />
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

/**
 * Get the common dates from a list of tickers
 * @param {Object[]} tickerData - List of ticker data
 * @returns {string[]} - List of common dates
 * @example
 * const commonDates = getCommonDates(tickerData);
 * console.log(commonDates);
 * // valid
 * // ["01-01-2021", "02-01-2021", "03-01-2021"]
 * // invalid
 * // ["01-01-2021", "02-01-2021", "03-01-2021", "04-01-2021"]
 * // results:
 * // ["01-01-2021", "02-01-2021", "03-01-2021"]
 */
const getCommonDates = (tickerData) => {
  const dates = tickerData.map((ticker) => ticker.data.map((row) => row.timestamp));
  const intersection = dates.reduce((acc, curr) => acc.filter((date) => curr.includes(date)));
  const commonDates = Array.from(new Set(intersection.flat()));

  const formattedDates = commonDates.map((date) => {
    const [day, month, year] = date.split('-');
    return new Date(`${month}-${day}-${year}`);
  });

  return formattedDates;
};

export default Chart;
