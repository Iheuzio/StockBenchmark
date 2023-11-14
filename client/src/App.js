import './App.css';
import Search from './Search/Search';
import Chart from './Chart/Chart';
import StockInfo from './Chart/StockInfo';

function App() {
  var tickers = ['RE', 'REGN', 'RF']
  return (
    <>
      <Search />
      <Chart tickers={tickers} />
      <StockInfo stockId={"RE"}/>
    </>
  );
}

export default App;
