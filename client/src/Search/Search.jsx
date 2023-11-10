import './Search.css'
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar/SearchBar';
import SearchResult from './SearchResult/SearchResult';

function Search() {
  const [tickers, setTickers] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTickers = async () => {
      const res = await fetch('/tickers');
      const json = await res.json();
      setTickers(json);
    };
    fetchTickers();
  }, []);


  if (tickers) {
    const results = tickers.filter((ticker) => {
      if (search.length > 0) {
        return ticker.ticker.toLowerCase().includes(search.toLowerCase());
      }
      return false;
    })
    
    return (
      <div className='Search'>
        <SearchBar setSearch={setSearch} />
        <SearchResult results={results} />
      </div>
    );
  }
}

export default Search;