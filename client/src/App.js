import './App.css';
import Search from './Search/Search';
import Chart from './Chart/Chart';

function App() {
  var tickers = ['RE', 'REGN', 'RF']
  return (
    <>
      <Search />
      <Chart tickers={tickers} />
    </>
  );
}

export default App;
