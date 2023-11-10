import './SearchResult.css';
import parse from 'html-react-parser';

function SearchResult({results, search}) {
  return (
    <div className='SearchResult'>
      <ul className='SearchResultUl'>

        {results.map((result) => {
          let ticker = result.ticker
          ticker = ticker.replace(search.toUpperCase(), '<b>' + search.toUpperCase() + '</b>')
          return (
            <li 
              key={result.ticker}
              className='SearchResultList'>
                {parse(ticker)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchResult;