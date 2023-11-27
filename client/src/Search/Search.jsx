import './Search.css'
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar/SearchBar';
import SearchResult from './SearchResult/SearchResult';
import burgerBar from '../images/burger-bar.png'
import FollowOption from './FollowOption/FollowOption';

/**
 * Component that displays the search feature
 * @param {useStateCallBack} setSelectedTickers - Callback function to set the current tickers selected
 * @returns {JSX.Element} - The Search component.
 */
function Search({selectedTickers, setSelectedTickers}) {
  // Init State
  const [allTickers, setAllTickers] = useState(null);
  const [favTickers, setFavTickers] = useState(null);
  const [search, setSearch] = useState('');
  const [isFollowOption, setIsFollowOption] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  // Fetch list of all tickers name from server
  useEffect(() => {
    const fetchTickers = async () => {
      const res = await fetch('/tickers');
      const json = await res.json();
      setAllTickers(json);
    };
    fetchTickers();
  }, []);

  // Fetch list of all tickers name from localStorage
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

  // If any data is fetched and the data's option is selected render
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
            <img 
                className='SearchImage' 
                src={burgerBar} 
                alt=''
                onClick={() => setIsSearch(!isSearch)} />
              <SearchBar setSearch={setSearch} />
              <FollowOption 
                isFollowOption={isFollowOption}
                setIsFollowOption={setIsFollowOption} />
            </div>
            <SearchResult 
              results={results} 
              search={search} 
              selectedTickers={selectedTickers}
              setSelectedTickers={setSelectedTickers} />
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