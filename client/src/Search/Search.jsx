import './Search.css'
import { useEffect, useState } from 'react';

function Search() {
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
      <div className='Search'>
        
      </div>
    );
  }
}

export default Search;