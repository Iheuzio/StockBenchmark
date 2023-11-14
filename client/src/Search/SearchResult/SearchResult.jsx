import './SearchResult.css';
import parse from 'html-react-parser';

/**
 * Component that displays the search results
 * @param {string[]} results - All posible search results
 * @param {string} search - Search to filter the results list
 * @param {useStateCallBack} setSelectedTickers - Callback function to set the current tickers selected
 * @returns {JSX.Element} - The SearchResult component.
 */
function SearchResult({results, search, setSelectedTickers}) {
  return (
    <div className='SearchResult'>
      <ul className='SearchResultUl'>
        {results.map((result) => {
          const ticker = result.ticker;
          const regex = /<|>|\//;
          if (!ticker.match(regex)) {
            let formatTicker = ticker.replace(search.toUpperCase(), '<b>' + search.toUpperCase() + '</b>');
            return (
              <li 
                key={result.ticker}
                className='SearchResultList'
                onClick={() => setSelectedTickers(oldTickers => [...oldTickers, ticker])}>
                  {parse(formatTicker)}
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}

export default SearchResult;