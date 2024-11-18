import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [watchlist, setWatchlist] = useState(['bitcoin', 'ethereum', 'dogecoin', 'cardano', 'solana']);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist'));
    if (storedWatchlist) {
      setWatchlist(storedWatchlist);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const responses = await Promise.all(
          watchlist.map((coin) =>
            axios.get(`https://api.coincap.io/v2/assets/${coin}`)
          )
        );
        setCoins(responses.map((res) => res.data.data));
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };

    fetchCoins();
  }, [watchlist]);

  const handleAddCoin = () => {
    if (!watchlist.includes(search.toLowerCase()) && watchlist.length < 10) {
      setWatchlist([...watchlist, search.toLowerCase()]);
      setSearch('');
    }
  };

  const handleRemoveCoin = (coinId) => {
    setWatchlist(watchlist.filter((coin) => coin !== coinId));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>

      {/* Search & Add */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Add a coin (e.g., polkadot)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded-l-lg w-80"
        />
        <button
          onClick={handleAddCoin}
          className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
          disabled={!search || watchlist.includes(search.toLowerCase())}
        >
          Add
        </button>
      </div>

      {/* Coins Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <div key={coin.id} className="bg-gray-100 p-4 rounded-lg shadow relative flex flex-col items-center">

            {/* Remove Button */}
            <button onClick={() => handleRemoveCoin(coin.id)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm font-bold" aria-label="Remove">
              ×
            </button>
            
            {/* Coin Info */}
            <h2 className="text-lg font-bold">{coin.name}</h2>
            <p className="text-green-500">Price: ${parseFloat(coin.priceUsd).toFixed(2)}</p>
            <p className="text-gray-600">Market Cap: ${parseFloat(coin.marketCapUsd).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Watchlist Limit */}
      {watchlist.length >= 10 && (
        <p className="text-red-500 text-center mt-4">You can only track up to 10 coins!</p>
      )}
    </div>
  );
};

export default Dashboard;
