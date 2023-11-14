import './Search.css'
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar/SearchBar';
import SearchResult from './SearchResult/SearchResult';
import burgerBar from '../images/burger-bar.png'
import FollowOption from './FollowOption/FollowOption';

function Search({selectedTickers, setSelectedTickers}) {
  const [allTickers, setAllTickers] = useState(null);
  const [favTickers, setFavTickers] = useState(null);
  const [search, setSearch] = useState('');
  const [isFollowOption, setIsFollowOption] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    const fetchTickers = async () => {
      const res = await fetch('/tickers');
      const json = await res.json();
      setAllTickers(json);
    };
    fetchTickers();
  }, []);

  useEffect(() => {
    const getFavTickers = () => {
      let storageTickers = localStorage.getItem('favTickers');
      if (!storageTickers) {
        storageTickers = []
      }
      setFavTickers(storageTickers);
    }
    getFavTickers();
  }, []);

  if ((allTickers && !isFollowOption) || (favTickers && isFollowOption)) {
    let tickers;
    if (isFollowOption) {
      tickers = favTickers
    } else {
      tickers = allTickers
    }
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
      <>
        {isSearch ?
          <div className='SearchOn'>
            <div className='SearchOptions'>
              <SearchBar setSearch={setSearch} />
              <FollowOption 
                isFollowOption={isFollowOption}
                setIsFollowOption={setIsFollowOption} />
              <img 
                className='SearchImage' 
                src={burgerBar} 
                alt=''
                onClick={() => setIsSearch(!isSearch)} />
            </div>
            <SearchResult results={results} search={search} selectedTickers={selectedTickers} setSelectedTickers={setSelectedTickers} />
          </div>
          :
          <div 
            className='SearchOff'
            onClick={() => setIsSearch(!isSearch)}>
            <img 
              className='SearchImage' 
              src={burgerBar} 
              alt='' />
          </div>
        }
      </>
    );
  }
}

export default Search;