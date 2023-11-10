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
      return ticker.ticker.toLowerCase().startsWith(search.toLowerCase());
    })
    .slice(0,5);

    return (
      <div className='Search'>
        <SearchBar setSearch={setSearch} />
        {(search.length > 0) &&
        <SearchResult results={results} search={search} />}
      </div>
    );
  }
}

export default Search;