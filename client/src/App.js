import './App.css';
import Search from './Search/Search';
import Chart from './Chart/Chart';
import { useState } from 'react';

function App() {
  const [selectedTickers, setSelectedTickers] = useState([])
  
  return (
    <>
      <Search selectedTickers={selectedTickers} setSelectedTickers={setSelectedTickers} />
      <Chart tickers={selectedTickers} />
    </>
  );
}

export default App;
