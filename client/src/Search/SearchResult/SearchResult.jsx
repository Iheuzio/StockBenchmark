import './SearchResult.css'

function SearchResult({results}) {
  return (
    <div>
      {results.map((result) => {
        return <p>{result.ticker}</p>
      })}
    </div>
  );
}

export default SearchResult;