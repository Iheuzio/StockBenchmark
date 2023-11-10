import './SearchBar.css'

function SearchBar({setSearch}) {
  return (
    <div>
      <input 
        className='SearchBarInput'
        placeholder='Search'
        onChange={ (e) => setSearch(e.target.value) }/>
    </div>
  );
}

export default SearchBar;