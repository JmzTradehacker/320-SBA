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
    <div>
      <h1>Dashboard</h1>
      {cryptoData ? (
        <div>
          <p>Name: {cryptoData.name}</p>
          <p>Price: ${parseFloat(cryptoData.priceUsd).toFixed(2)}</p>
          <p>Market Cap: ${parseFloat(cryptoData.marketCapUsd).toFixed(2)}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
