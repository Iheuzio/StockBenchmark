import './SearchBar.css'

function SearchBar({setSearch}) {
  return (
    <div className='SearchBar'>
      <input 
        className='SearchBarInput'
        placeholder='Search'
        onChange={ (e) => setSearch(e.target.value) }/>
    </div>
  );
}

export default SearchBar;