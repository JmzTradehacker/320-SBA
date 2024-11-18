import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [cryptoData, setCryptoData] = useState(null);

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const response = await axios.get(
          'https://api.coincap.io/v2/assets/bitcoin'
        );
        setCryptoData(response.data.data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchCrypto();
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
      {cryptoData ? (
        <div className="space-y-2 text-center">
          <p className="text-lg">
            <span className="font-semibold">Name:</span> {cryptoData.name}
          </p>
          <p className="text-green-500 text-lg">
            <span className="font-semibold">Price:</span> $
            {parseFloat(cryptoData.priceUsd).toFixed(2)}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-semibold">Market Cap:</span> $
            {parseFloat(cryptoData.marketCapUsd).toFixed(2)}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
