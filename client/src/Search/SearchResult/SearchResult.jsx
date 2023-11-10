import './SearchResult.css'

function SearchResult({results}) {
  return (
    <div className='SearchResult'>
      <ul className='SearchResultUl'>

        {results.map((result) => {
          return <li className='SearchResultList'>{result.ticker}</li>
        })}
      </ul>
    </div>
  );
}

export default SearchResult;