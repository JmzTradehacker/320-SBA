import React, { useState } from 'react';

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState({ symbol: '', quantity: '' });

  const handleAddTrade = () => {
    setTrades([...trades, { ...newTrade, id: Date.now() }]);
    setNewTrade({ symbol: '', quantity: '' });
  };

  const handleRemoveTrade = (id) => {
    setTrades(trades.filter((trade) => trade.id !== id));
  };

  return (
    <div>
      <h1>Trades</h1>
      <input
        type="text"
        placeholder="Symbol (e.g., BTC/USD)"
        value={newTrade.symbol}
        onChange={(e) => setNewTrade({ ...newTrade, symbol: e.target.value })}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={newTrade.quantity}
        onChange={(e) => setNewTrade({ ...newTrade, quantity: e.target.value })}
      />
      <button onClick={handleAddTrade}>Add Trade</button>

      <ul>
        {trades.map((trade) => (
          <li key={trade.id}>
            {trade.symbol} - Qty: {trade.quantity}
            <button onClick={() => handleRemoveTrade(trade.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trades;
