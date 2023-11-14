import './App.css';
import Search from './Search/Search';
import Chart from './Chart/Chart';
import { useState } from 'react';

function App() {
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [removeTicker, setRemoveTicker] = useState(null);

  const handleRemoveTicker = (ticker) => {
    setRemoveTicker(ticker);
  };

  return (
    <>
      <Search selectedTickers={selectedTickers} setSelectedTickers={setSelectedTickers} />
      <Chart tickers={selectedTickers} removeTicker={removeTicker} />
    </>
  );
}

export default App;
