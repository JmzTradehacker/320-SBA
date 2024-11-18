import React, { useState } from 'react';

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState({ symbol: '', quantity: '' });

  const handleAddTrade = () => {
    if (newTrade.symbol && newTrade.quantity > 0) {
      setTrades([...trades, { ...newTrade, id: Date.now() }]);
      setNewTrade({ symbol: '', quantity: '' });
    }
  };

  const handleRemoveTrade = (id) => {
    setTrades(trades.filter((trade) => trade.id !== id));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Trades</h1>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Symbol (e.g., BTC/USD)"
          value={newTrade.symbol}
          onChange={(e) => setNewTrade({ ...newTrade, symbol: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg w-full"
        />
        <input
          type="number"
          placeholder="Quantity"
          min="1"
          value={newTrade.quantity}
          onChange={(e) =>
            setNewTrade({ ...newTrade, quantity: parseInt(e.target.value) || '' })
          }
          className="border border-gray-300 p-2 rounded-lg w-full"
        />
        <button
          onClick={handleAddTrade}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!newTrade.symbol || newTrade.quantity <= 0}
        >
          Add Trade
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {trades.map((trade) => (
          <li
            key={trade.id}
            className="bg-gray-100 p-4 rounded-lg shadow flex justify-between items-center"
          >
            <span>
              {trade.symbol} - Qty: {trade.quantity}
            </span>
            <button
              onClick={() => handleRemoveTrade(trade.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trades;
