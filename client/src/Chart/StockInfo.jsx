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
          <h2>{stockInfo.name}</h2>
          <p>{stockInfo.description}</p>
          <p>Price: {stockInfo.price}</p>
          <p>Volume: {stockInfo.volume}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StockInfo;