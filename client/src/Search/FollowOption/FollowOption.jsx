import './FollowOption.css'

function FollowOption({isFollowOption, setIsFollowOption}) {
  return (
    <div className='FollowOption' onClick={() => setIsFollowOption(!isFollowOption)}>
      <p className='FollowOptionP'>Followed</p>
      <input type='checkbox' checked={isFollowOption}/>
    </div>
  );
}

export default FollowOption;