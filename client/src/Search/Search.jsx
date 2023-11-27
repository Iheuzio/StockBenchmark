import './Search.css'
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar/SearchBar';
import SearchResult from './SearchResult/SearchResult';
import burgerBar from '../images/burger-bar.png'
import FollowOption from './FollowOption/FollowOption';

/**
 * Component that displays the search feature
 * @param {Object[]} selectedTickers - List of ticker Object that are currently displayed
 * @param {useStateCallBack} setSelectedTickers - Callback function to set the current tickers selected
 * @returns {JSX.Element} - The Search component.
 */
function Search({selectedTickers, setSelectedTickers}) {
  // Init State
  const [allTickers, setAllTickers] = useState(null);
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

  // If any data is fetched and the data's option is selected render
  if (allTickers) {
    let results = allTickers.filter((ticker) => {
      return ticker.ticker.toLowerCase().startsWith(search.toLowerCase());
    });
    if (results.length < 5) {
      results = results.concat(allTickers.filter((ticker) => {
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
              isFollowOption={isFollowOption}
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