import './SearchResult.css';
import Result from './Result/Result';
import { useEffect, useState } from 'react';

/**
 * Component that displays the search results
 * @param {string[]} results - All posible search results
 * @param {string} search - Search to filter the results list
 * @param {useStateCallBack} setSelectedTickers - Callback function to set the current tickers selected
 * @returns {JSX.Element} - The SearchResult component.
 */
function SearchResult({results, search, isFollowOption, selectedTickers, setSelectedTickers}) {
  const [followList, setFollowList] = useState([]);

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
          if (!ticker.match(regex)) {
            let formatTicker = ticker.replace(search.toUpperCase(), '<b>' + search.toUpperCase() + '</b>');
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