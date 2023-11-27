import './Result.css';

import parse from 'html-react-parser';
import FollowImageOn from '../../../images/follow-on.png';
import FollowImageOff from '../../../images/follow-off.png';
import { useState } from 'react';

function Result({result, selectedTickers, setSelectedTickers, resultName}) {
  const [isFollowed, setIsFollowed] = useState(false);
  return (
    <li 
      key={result.ticker}
      className='SearchResultList'
      onClick={() => {
        setSelectedTickers(oldTickers => {
          if (oldTickers.filter((oldTicker) => oldTicker.ticker === result.ticker).length > 0) {
            // If the ticker is already selected, remove it
            return oldTickers.filter((selectedTicker) => selectedTicker.ticker !== result.ticker);
          } else {
            // If the ticker is not selected, add it
            return [...oldTickers, {
              ticker:result.ticker, 
              color:getRandomColor(),

            }];
          }
        })}}>
        <p>
          {parse(resultName)}
          {
            selectedTickers.length > 0 && 
            selectedTickers.filter((selectTicker) => selectTicker.ticker === result.ticker).length > 0 &&
            <>&#10003;</>
          }
        </p>
        <div 
          className='ImageDiv'
          onClick={(e) => {
            e.stopPropagation();
            setIsFollowed((old) => !old);
            }}>
          {isFollowed ?
            <img src={FollowImageOn} alt='' className='FollowImage' />
            :
            <img src={FollowImageOff} alt='' className='FollowImage' />
          }
        </div>
    </li>
  );
}

export default Result;

/**
 * Returns a random hex color code.
 * @returns {string} A random hex color code.
 */
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
