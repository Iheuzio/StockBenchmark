import React, { useState, useEffect } from 'react';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import Chart from './Chart';

const StockLink = ({ stockId }) => {
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    fetch(`/tickers/${stockId}`)
      .then(response => response.json())
      .then(data => setStockData(data))
      .catch(error => console.error('Error:', error));
  }, [stockId]);

  return (
    <div>
      {/* should work if Chart takes in stockID as a prop */}
      <Link to={`/chart/${stockId}`}>Generate Chart</Link>
      <Route path={`/chart/${stockId}`} render={() => stockData && <Chart data={stockData} />} />
    </div>
  );
};

export default StockLink;

//Wrap the app in a Router component in App.js:
//import { BrowserRouter as Router } from 'react-router-dom';

// ...

//<Router>
  //<App />
//</Router>