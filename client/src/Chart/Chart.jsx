import './Chart.css';
import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';

function Chart({ tickers }) {
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    const fetchData = async (ticker) => {
      const res = await fetch(`/tickers/${ticker}`);
      const json = await res.json();
      return json;
    };

    const fetchAllTickers = async () => {
      const data = await Promise.all(tickers.map((ticker) => fetchData(ticker)));
      setTickerData(data);
    };

    fetchAllTickers();
  }, [tickers]);

  if (tickerData.length > 0) {
    const commonDates = getCommonDates(tickerData);

    // plot the data
    return (
      <div className="chart">
        <Plot
          data={tickerData.map((ticker, index) => ({
            x: commonDates,
            y: getAdjustedCloseValues(ticker),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: getRandomColor() },
            name: `Adjusted Close - ${tickers[index]}`,
          }))}
          layout={{ width: 1200, height: 600, title: `Stock Prices Comparison` }}
        />
      </div>
    );
  }

  return null;
}

// Helper function to get common dates among all tickers
const getCommonDates = (tickerData) => {
  const dates = tickerData.map((ticker) => ticker.data.map((row) => row.timestamp));
  const intersection = dates.reduce((acc, curr) => acc.filter((date) => curr.includes(date)));
  return Array.from(new Set(intersection.flat()));
};

// Helper function to get adjusted close values for a ticker
const getAdjustedCloseValues = (ticker) => {
  return ticker.data.map((row) => row.adjustedClose);
};

// Helper function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default Chart;
