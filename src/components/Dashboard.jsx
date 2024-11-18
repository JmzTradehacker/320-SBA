import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CoinCard from './CoinCard';
import '../chartConfig'; // Register Chart.js components

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [watchlist, setWatchlist] = useState(['bitcoin', 'ethereum', 'dogecoin', 'cardano', 'solana']);
  const [historicalData, setHistoricalData] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Load watchlist from localStorage on mount
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist'));
    if (storedWatchlist) {
      setWatchlist(storedWatchlist);
    }
  }, []);

  useEffect(() => {
    // Save watchlist to localStorage whenever it changes
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    // Fetch coin data
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

    // Fetch historical data for charts
    const fetchHistoricalData = async () => {
      try {
        const historicalResponses = await Promise.all(
          watchlist.map((coin) =>
            axios.get(`https://api.coincap.io/v2/assets/${coin}/history?interval=d1`)
          )
        );
        const historicalDataMap = {};
        historicalResponses.forEach((res, index) => {
          const coinId = watchlist[index];
          historicalDataMap[coinId] = res.data.data.map((entry) => ({
            date: entry.time,
            price: parseFloat(entry.priceUsd),
          }));
        });
        setHistoricalData(historicalDataMap);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchCoins();
    fetchHistoricalData();
  }, [watchlist]);

  const handleAddCoin = async () => {
    if (!search) return; // Ensure search input is not empty
  
    const normalizedInput = search.trim().toLowerCase(); // Normalize input
    let coinId = ''; // Variable to store validated coin ID
  
    // Check if input ends with /usd (e.g., btc/usd)
    if (normalizedInput.includes('/usd')) {
      coinId = normalizedInput.split('/')[0]; // Extract coin symbol 
    } else {
      // Fetch all coins from the API and find a match
      try {
        const response = await axios.get('https://api.coincap.io/v2/assets');
        const matchedCoin = response.data.data.find(
          (coin) =>
            coin.id === normalizedInput || // Match full coin ID 
            coin.symbol.toLowerCase() === normalizedInput || // Match symbol 
            coin.name.toLowerCase() === normalizedInput // Match name 
        );
  
        if (matchedCoin) {
          coinId = matchedCoin.id; // Assign validated coin ID
        }
      } catch (error) {
        console.error('Error validating coin:', error);
        alert('Error fetching coin data. Please try again later.');
        return;
      }
    }
  
    // Validate coinId and ensure it's not a duplicate
    if (coinId && !watchlist.includes(coinId)) {
      setWatchlist([...watchlist, coinId]);
      setSearch(''); // Clear search input
    } else if (watchlist.includes(coinId)) {
      alert('Coin is already in your watchlist.');
    } else {
      alert('Invalid coin. Please check your input.');
    }
  };

  const handleRemoveCoin = (coinId) => {
    setWatchlist(watchlist.filter((coin) => coin !== coinId));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>

      {/* Search & Add */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Add a coin (e.g., DOT, polkadot, DOT/USD)"
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
          <CoinCard
            key={coin.id}
            coin={coin}
            historicalData={historicalData}
            handleRemoveCoin={handleRemoveCoin}
          />
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
