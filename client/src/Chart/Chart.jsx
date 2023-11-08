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
      const res2 = await fetch('/tickers/SAXPF');
      const json2 = await res2.json();
      setTicker2(json2);
    };
    fetchTickers();
  }, []);

  if (ticker && ticker2) {
    const dates = ticker.data.map((row) => row.timestamp);
    const adjustedClose = ticker.data.map((row) => row.adjustedClose);
    const dates2 = ticker2.data.map((row) => row.timestamp);
    const adjustedClose2 = ticker2.data.map((row) => row.adjustedClose);
    // const open = ticker.data.map((row) => row.open);
    // const close = ticker.data.map((row) => row.close);
    // const high = ticker.data.map((row) => row.high);
    // const low = ticker.data.map((row) => row.low);
    // const volume = ticker.data.map((row) => row.volume);

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