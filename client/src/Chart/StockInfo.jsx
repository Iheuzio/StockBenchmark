import React, { useState, useEffect } from 'react';

const StockInfo = ({ stockId }) => {
  const [stockInfo, setStockInfo] = useState(null);

  useEffect(() => {
    fetch(`/tickers/${stockId}`)
      .then(response => response.json())
      .then(data => setStockInfo(data))
      .catch(error => console.error('Error:', error));
  }, [stockId]);

  return (
    <div>
      {stockInfo ? (
        <div>
          {'Low,Open,Volume,High,Close,Adjusted Close'}
          <h2>{stockInfo.name}</h2>
          <p>Volume: {stockInfo.Volume}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StockInfo;