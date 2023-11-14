import './SearchResult.css';
import parse from 'html-react-parser';

function SearchResult({results, search, selectedTickers, setSelectedTickers}) {
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