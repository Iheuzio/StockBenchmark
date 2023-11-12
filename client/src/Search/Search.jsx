import './Search.css'
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar/SearchBar';
import SearchResult from './SearchResult/SearchResult';
import burgerBar from '../images/burger-bar.png'
import FollowOption from './FollowOption/FollowOption';

function Search() {
  const [tickers, setTickers] = useState(null);
  const [search, setSearch] = useState('');
  const [isFollowOption, setIsFollowOption] = useState(false);

  useEffect(() => {
    const fetchTickers = async () => {
      const res = await fetch('/tickers');
      const json = await res.json();
      setTickers(json);
    };
    fetchTickers();
  }, []);


  if (tickers) {
    let results = tickers.filter((ticker) => {
      return ticker.ticker.toLowerCase().startsWith(search.toLowerCase());
    });
    if (results.length < 5) {
      results = results.concat(tickers.filter((ticker) => {
        return ticker.ticker.toLowerCase().includes(search.toLowerCase()) &&
               !results.includes(ticker);
      }));
    }

    return (
      <div className='Search'>
        <div className='SearchOptions'>
          <SearchBar setSearch={setSearch} />
          <FollowOption 
            isFollowOption={isFollowOption}
            setIsFollowOption={setIsFollowOption} />
          <img className='SearchImage' src={burgerBar} alt='' />
        </div>
        <SearchResult results={results} search={search} />
      </div>
    );
  }
}

export default Search;