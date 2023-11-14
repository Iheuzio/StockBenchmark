import './SearchResult.css';
import parse from 'html-react-parser';

function SearchResult({results, search, selectedTickers, setSelectedTickers}) {
  return (
    <div className='SearchResult'>
      <ul className='SearchResultUl'>

        {results.map((result) => {
          let ticker = result.ticker
          let formatTicker = ticker.replace(search.toUpperCase(), '<b>' + search.toUpperCase() + '</b>')
          return (
            <li 
              key={result.ticker}
              className='SearchResultList'
              onClick={() => setSelectedTickers(oldTickers => [...oldTickers, ticker])}>
                {parse(formatTicker)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchResult;