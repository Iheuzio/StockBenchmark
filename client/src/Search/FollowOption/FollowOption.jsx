import './FollowOption.css'

/**
 * Component that displays the search feature
 * @param {boolean} isFollowOption - Value to determine if the checkbox is selected
 * @param {useStateCallBack} setIsFollowOption - Callback function to set the isFollowOption
 * @returns {JSX.Element} - The FollowOption component.
 */
function FollowOption({isFollowOption, setIsFollowOption}) {
  return (
    <div className='FollowOption' onClick={() => setIsFollowOption(oldFollowOption => !oldFollowOption)}>
      <p className='FollowOptionP'>Followed</p>
      <input type='checkbox' defaultChecked={isFollowOption}/>
    </div>
  );
}

export default FollowOption;