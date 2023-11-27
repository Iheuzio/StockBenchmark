import './Result.css';

import parse from 'html-react-parser';
import FollowImageOn from '../../../images/follow-on.png';
import FollowImageOff from '../../../images/follow-off.png';

function Result({result, followList, setFollowList, selectedTickers, setSelectedTickers, resultName}) {
  console.log(followList)
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
            setFollowList((old) => {
              let newList
              if (old.length > 0) {
                if (old.filter((tickerName) => tickerName === result.ticker).length > 0) {
                  newList = old.filter((tickerName) => tickerName !== result.ticker);
                } else {
                  newList = [...old, result.ticker];
                }
              } else {
                newList = [...old, result.ticker];
              }
              localStorage.setItem("followed", JSON.stringify(newList))
              return newList;
            })
            }}>
          {
          followList.filter((tickerName) => tickerName === result.ticker).length > 0 ?
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
