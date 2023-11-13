import './App.css';
// import Tickers from './Tickers/Tickers';
import Chart from './Chart/Chart';

function App() {
  var tickers = ['RE', 'REGN', 'RF']
  return (
    <>
    <Chart tickers={tickers} />
    </>
  );
}

export default App;
