import './Chart.css'
import Plot from 'react-plotly.js';

import { useEffect, useState } from 'react';

function Chart() {
  const [ticker, setTicker] = useState(null);
  const [ticker2, setTicker2] = useState(null);

  useEffect(() => {
    const fetchTickers = async () => {
      const res = await fetch('/tickers/SAXPF');
      const json = await res.json();
      setTicker(json);
    };
    fetchTickers();
  }, []);

  useEffect(() => {
    const fetchTickers = async () => {
      const res2 = await fetch('/tickers/UUGRY');
      const json2 = await res2.json();
      setTicker2(json2);
    };
    fetchTickers();
  }, []);

  if (ticker && ticker2) {
    console.log(ticker.data[0].timestamp);
    console.log(ticker2.data[0].timestamp);
    const dateString = ticker.data[0].timestamp.split('T')[0];
    const [day, month, year] = dateString.split('-');
    const date1 = new Date(year, month - 1, day);
    const dateString2 = ticker2.data[0].timestamp.split('T')[0];
    const [day2, month2, year2] = dateString2.split('-');
    const date2 = new Date(year2, month2 - 1, day2);
    // get furthest end date
    const dataStringEnd = ticker.data[ticker.data.length - 1].timestamp.split('T')[0];
    const [dayEnd, monthEnd, yearEnd] = dataStringEnd.split('-');
    const dateEnd = new Date(yearEnd, monthEnd - 1, dayEnd);
    const dataStringEnd2 = ticker2.data[ticker2.data.length - 1].timestamp.split('T')[0];
    const [dayEnd2, monthEnd2, yearEnd2] = dataStringEnd2.split('-');
    const dateEnd2 = new Date(yearEnd2, monthEnd2 - 1, dayEnd2);
    const maxStartDate = Math.max(
      dateEnd.getTime(),
      dateEnd2.getTime()
    );
    console.log(maxStartDate);

    const minEndDate = Math.min(
      date1.getTime(),
      date2.getTime()
    );
    console.log(minEndDate);
    const filteredTickerData = ticker.data.filter(
      (row) => {
        const rowtime = row.timestamp.split('T')[0];
        const [day, month, year] = rowtime.split('-');
        row = new Date(year, month - 1, day);
        if (row.getTime() >= minEndDate && row.getTime() <= maxStartDate) {
          return true;
        }
        return false;
      }
    );
    const filteredTicker2Data = ticker2.data.filter(
      (row) => {
        const rowtime = row.timestamp.split('T')[0];
        const [day, month, year] = rowtime.split('-');
        row = new Date(year, month - 1, day);
        if (row.getTime() >= minEndDate && row.getTime() <= maxStartDate) {
          return true;
        }
        return false;
      }
    );

    const dates = filteredTickerData.map((row) => row.timestamp);
    console.log(dates);
    const adjustedClose = filteredTickerData.map((row) => row.adjustedClose);
    const dates2 = filteredTicker2Data.map((row) => row.timestamp);
    console.log(dates2);
    const adjustedClose2 = filteredTicker2Data.map((row) => row.adjustedClose);

    const percentageChange = (arr) => {
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
          result.push(0);
        } else {
          const diff = Math.log(arr[i] / arr[i - 1]);
          result.push(diff * 100);
        }
      }
      return result;
    };

    const adjustedClosePercentage = percentageChange(adjustedClose);
    const adjustedClose2Percentage = percentageChange(adjustedClose2);

    // plot the data
    return (
      <div className="chart">
        <Plot
          data={[
            {
              x: dates,
              y: adjustedClose,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'blue' },
              name: 'Adjusted Close',
            },
            {
              x: dates2,
              y: adjustedClose2,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'red' },
              name: 'Adjusted Close',
            },
           
          ]}
          layout={{ width: 1200, height: 600, title: 'VUPPF' }}
        />
      </div>
    );
   
  }
}

export default Chart;