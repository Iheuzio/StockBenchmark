import './Tickers.css'
import { useEffect, useState } from 'react';

function Tickers() {
  const [tickers, setTickers] = useState(null);

  useEffect(() => {
    const fetchTickers = async () => {
      const res = await fetch('/tickers');
      const json = await res.json();
      setTickers(json);
    };
    fetchTickers();
  }, []);

  if (tickers) {
    return (
      <ul>
        {tickers.map((ticker) => {
          return <li>{ticker.ticker}</li>
        })}
      </ul>
    );
  }
}

export default Tickers;