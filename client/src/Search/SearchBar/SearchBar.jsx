import './SearchBar.css'

/**
 * Component that displays the search feature
 * @param {useStateCallBack} setSearch - Callback function to set the search state
 * @returns {JSX.Element} - The SearchBar component.
 */
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