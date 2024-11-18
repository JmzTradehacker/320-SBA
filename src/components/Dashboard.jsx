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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
        {cryptoData ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold">Name: {cryptoData.name}</p>
            <p className="text-green-500">Price: ${parseFloat(cryptoData.priceUsd).toFixed(2)}</p>
            <p className="text-gray-600">Market Cap: ${parseFloat(cryptoData.marketCapUsd).toFixed(2)}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
      </div>
    );
  };
  

export default Dashboard;
