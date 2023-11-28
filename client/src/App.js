import './App.css';
import Search from './Search/Search';
import Chart from './Chart/Chart';
import { useState } from 'react';

function App() {
  // Init State
  const [selectedTickers, setSelectedTickers] = useState([{ticker:'REPYY', color:""}])
  
  return (
    <>
      <Search selectedTickers={selectedTickers} setSelectedTickers={setSelectedTickers} />
      <Chart tickers={selectedTickers} />
    </>
  );
}

export default App;
