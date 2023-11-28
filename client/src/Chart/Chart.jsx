import React, { useState, useEffect } from 'react';
import './Chart.css';
import Plot from 'react-plotly.js';
import useSWR from 'swr';
import Draggable from 'react-draggable';

function Chart({ tickers }) {
  const [tickerData, setTickerData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [selectedTickerInfo, setSelectedTickerInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    const fetchAllTickers = async () => {
      const monthData = await Promise.all(tickers.map((ticker) => fetchData(ticker.ticker)));
      setTickerData(monthData);

      const fullData = await Promise.all(tickers.map((ticker) => fetchFullData(ticker.ticker)));
      setTickerData(fullData);
    };

    fetchAllTickers();
  }, [tickers]);

  const [showModal, setShowModal] = useState(false);

  const handleTickerButtonClick = (ticker) => {
    setSelectedTicker(ticker);
    updateSelectedTickerInfo(ticker);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowAllButtonClick = () => {
    setSelectedTicker(null);
    setSelectedTickerInfo(null);
    setShowModal(false);
  };

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
  
      const rsi = calculateRSI(selectedTickerData.data);
  
      const fibonacciLevels = calculateFibonacciLevels(selectedTickerData.data);
  
      setSelectedTickerInfo({
        highestValue: highestHigh,
        highestValueDate: highestHighDate,
        lowestValue: lowestLow,
        lowestValueDate: lowestLowDate,
        rsi,
        fibonacciLevels,
      });
    } else {
      setSelectedTickerInfo(null);
    }
  };
  
  const calculateRSI = (data) => {
    data = data.slice(0, 14);
    const up = [];
    const down = [];
    for(let i = 1; i < data.length; i++) {
      const diff = data[i].close - data[i-1].close;
      if(diff > 0) {
        up.push(diff);
      } else {
        down.push(Math.abs(diff));
      }
    }
    const avgUp = up.reduce((a, b) => a + b, 0) / up.length;
    const avgDown = down.reduce((a, b) => a + b, 0) / down.length;
    const rsiValue = 100 - (100 / (1 + (avgUp / avgDown)));
    return rsiValue;
  };
  
  const calculateFibonacciLevels = (data) => {
    const highestHigh = Math.max(...data.map((row) => row.high));
    const lowestLow = Math.min(...data.map((row) => row.low));
    const fibonacciLevels = [];
    fibonacciLevels.push(highestHigh);
    fibonacciLevels.push(highestHigh - ((highestHigh - lowestLow) * 0.236));
    fibonacciLevels.push(highestHigh - ((highestHigh - lowestLow) * 0.382));
    fibonacciLevels.push(highestHigh - ((highestHigh - lowestLow) * 0.5));
    fibonacciLevels.push(highestHigh - ((highestHigh - lowestLow) * 0.618));
    fibonacciLevels.push(highestHigh - ((highestHigh - lowestLow) * 0.786));
    fibonacciLevels.push(lowestLow);
    return fibonacciLevels;
  };
  

  const { data: candlestickData } = useSWR([tickerData, selectedTicker], () => {
    // check if selectedTicker then only show that ticker
    // otherwise show all tickers
    if(selectedTicker) {
      const selectedTickerData = tickerData.filter((ticker) => ticker.ticker === selectedTicker);
      return selectedTickerData.map((ticker) => {
        const commonDates = getCommonDates(selectedTickerData);
        console.log(commonDates);
        const formattedDates = commonDates.map((date) => {
          const [day, month, year] = date.split('-');
          return new Date(`${month}-${day}-${year}`);
        });

        const candlestick = {
          x: formattedDates,
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
      const formattedDates = commonDates.map((date) => {
        const [day, month, year] = date.split('-');
        return new Date(`${month}-${day}-${year}`);
      });

      const candlestick = {
        x: formattedDates,
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
          
          {/* Movable and resizable modal */}
          {showModal && (
            <Draggable>
              <div className="modal-overlay">
                <div className="modal-header">
                  <button className="close-button" onClick={handleCloseModal}>
                    &times;
                  </button>
                  <h4>{selectedTicker || 'All Stocks'} Additional Information</h4>
                </div>
                <div className="modal-body">
                  <p>Highest Value: ${selectedTickerInfo?.highestValue.toFixed(2)}</p>
                  <p>Lowest Value: ${selectedTickerInfo?.lowestValue.toFixed(2)}</p>
                  {selectedTickerInfo?.rsi !== undefined && (
                    <>
                      <p>Relative Strength Index (RSI): {selectedTickerInfo?.rsi}</p>
                      <p style={{ color: selectedTickerInfo?.rsi > 30 ? 'green' : 'red', fontWeight: 'bold' }}>
                        {selectedTickerInfo?.rsi > 30 ? 'Bullish' : 'Bearish'}
                      </p>
                    </>
                  )}
                  <p>
                    Fibonacci Levels: {selectedTickerInfo?.fibonacciLevels.join(', \n')}
                  </p>
                </div>
              </div>
            </Draggable>
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
