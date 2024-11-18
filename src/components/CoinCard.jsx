import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState({ symbol: '', quantity: '', type: '' });

  const fetchLivePrice = async (symbol) => {
    try {
      const normalizedInput = symbol.trim().toLowerCase();
      let coinId = '';

      if (normalizedInput.includes('/usd')) {
        coinId = normalizedInput.split('/')[0];
      } else {
        const response = await axios.get('https://api.coincap.io/v2/assets');
        const matchedCoin = response.data.data.find(
          (coin) =>
            coin.id === normalizedInput ||
            coin.symbol.toLowerCase() === normalizedInput ||
            coin.name.toLowerCase() === normalizedInput
        );

        if (matchedCoin) {
          coinId = matchedCoin.id;
        } else {
          throw new Error('Invalid coin symbol.');
        }
      }

      const livePriceResponse = await axios.get(
        `https://api.coincap.io/v2/assets/${coinId}`
      );
      return parseFloat(livePriceResponse.data.data.priceUsd);
    } catch (error) {
      console.error('Error fetching live price:', error);
      return null;
    }
  };

  const handleAddTrade = async (type) => {
    if (!newTrade.symbol || newTrade.quantity <= 0) return;

    const livePrice = await fetchLivePrice(newTrade.symbol);
    if (livePrice === null) {
      alert('Invalid symbol or unable to fetch live price.');
      return;
    }

    const tradeTime = new Date();
    setTrades([
      ...trades,
      {
        ...newTrade,
        type,
        id: Date.now(),
        entryPrice: livePrice,
        status: 'Open',
        time: tradeTime.toLocaleTimeString(),
        date: tradeTime.toLocaleDateString(),
        livePrice,
      },
    ]);
    setNewTrade({ symbol: '', quantity: '', type: '' });
  };

  const handleCloseTrade = async (id) => {
    const closedTrade = trades.find((trade) => trade.id === id);
    const livePrice = await fetchLivePrice(closedTrade.symbol);

    const resultColor =
      livePrice > closedTrade.entryPrice
        ? 'blue'
        : livePrice < closedTrade.entryPrice
        ? 'red'
        : 'gray';

    const closedTime = new Date();
    const duration = calculateDuration(
      closedTrade.date,
      closedTrade.time,
      closedTime
    );

    setTrades(
      trades.map((trade) =>
        trade.id === id
          ? {
              ...trade,
              status: 'Closed',
              exitPrice: livePrice,
              closedTime: closedTime.toLocaleTimeString(),
              closedDate: closedTime.toLocaleDateString(),
              duration,
              resultColor,
            }
          : trade
      )
    );
  };

  const handleRemoveTrade = (id) => {
    setTrades(trades.filter((trade) => trade.id !== id));
  };

  const calculateDuration = (startDate, startTime, endDateObj) => {
    const start = new Date(`${startDate} ${startTime}`);
    const end = endDateObj;

    const diff = end - start;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${days} days, ${hours} hours, ${minutes} minutes`;
  };

  // Refresh live prices every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedTrades = await Promise.all(
        trades.map(async (trade) => {
          if (trade.status === 'Open') {
            const livePrice = await fetchLivePrice(trade.symbol);
            return { ...trade, livePrice };
          }
          return trade;
        })
      );
      setTrades(updatedTrades);
    }, 10000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [trades]);

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
        <div className="flex space-x-4">
          <button
            onClick={() => handleAddTrade('Buy')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Buy
          </button>
          <button
            onClick={() => handleAddTrade('Sell')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Sell
          </button>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {trades.map((trade) => (
          <li
            key={trade.id}
            className={`p-4 rounded-lg shadow flex flex-col space-y-2 ${
              trade.resultColor === 'blue'
                ? 'bg-blue-100'
                : trade.resultColor === 'red'
                ? 'bg-red-100'
                : 'bg-gray-100'
            }`}
          >
            <div className="flex justify-between">
              <span className="font-bold text-lg">{trade.symbol.toUpperCase()}</span>
              <button
                onClick={() =>
                  trade.status === 'Open'
                    ? handleCloseTrade(trade.id)
                    : handleRemoveTrade(trade.id)
                }
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm font-bold"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col space-y-1">
              <p>Type: {trade.type}</p>
              <p>Quantity: {trade.quantity}</p>
              {trade.status === 'Open' ? (
                <p>
                  Status: {trade.status}, Entry: ${trade.entryPrice.toFixed(2)}, Live
                  P/L: $
                  {((trade.livePrice - trade.entryPrice) * trade.quantity).toFixed(2)}
                </p>
              ) : (
                <p>
                  Status: {trade.status}, Entry: ${trade.entryPrice.toFixed(2)},
                  Exit: ${trade.exitPrice.toFixed(2)}, Duration: {trade.duration},
                  Final P/L: $
                  {((trade.exitPrice - trade.entryPrice) * trade.quantity).toFixed(2)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trades;
