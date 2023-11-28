import './SearchResult.css';
import Result from './Result/Result';
import { useEffect, useState } from 'react';

/**
 * Component that displays the search results
 * @param {string[]} results - All posible search results
 * @param {string} search - Search to filter the results list
 * @param {boolean} isFollowOption - if followed option is selected
 * @param {Object[]} selectedTickers - List of ticker Object that are currently displayed
 * @param {useStateCallBack} setSelectedTickers - Callback function to set the current tickers selected
 * @returns {JSX.Element} - The SearchResult component.
 */
function SearchResult({results, search, isFollowOption, selectedTickers, setSelectedTickers}) {
  // Init State
  const [followList, setFollowList] = useState([]);

  // Get followed item from local storage
  useEffect(() => {
    const followed = localStorage.getItem("followed");
    if (followed) {
      setFollowList(JSON.parse(followed));
    }
  }, []);

  return (
    <div className='SearchResult'>
      <ul className='SearchResultUl'>
        {results.map((result) => {
          const ticker = result.ticker;
          const regex = /<|>|\//;
          // Make sure the data is safe because it will go through a html parser
          if (!ticker.match(regex)) {
            let formatTicker = ticker.replace(search.toUpperCase(), '<b>' + search.toUpperCase() + '</b>');
            // Display search result according to the follow toggle
            // if true display only followed ticker
            // else show all
            if (isFollowOption) {
              if (followList.includes(result.ticker)) {
                return (
                  <Result 
                    key={result.ticker}
                    result={result} 
                    followList={followList}
                    setFollowList={setFollowList}
                    selectedTickers={selectedTickers}
                    setSelectedTickers={setSelectedTickers}
                    resultName={formatTicker} />
                );
              }
            } else {
              return (
                <Result 
                  key={result.ticker}
                  result={result} 
                  followList={followList}
                  setFollowList={setFollowList}
                  selectedTickers={selectedTickers}
                  setSelectedTickers={setSelectedTickers}
                  resultName={formatTicker} />
              );
            }
          }
          return null;
        })}
      </ul>
    </div>
  );
}

export default SearchResult;