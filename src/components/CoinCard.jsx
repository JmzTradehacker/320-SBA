import React from 'react';
import { Line } from 'react-chartjs-2';

const CoinCard = ({ coin, historicalData, handleRemoveCoin }) => {
  return (
    <div key={coin.id} className="bg-gray-100 p-4 rounded-lg shadow relative flex flex-col items-center">

      {/* Remove Button */}
      <button
        onClick={() => handleRemoveCoin(coin.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm font-bold"
        aria-label="Remove"
      >
        ×
      </button>

      {/* Coin Info */}
      <h2 className="text-lg font-bold">{coin.name}</h2>
      <p className="text-green-500">Price: ${parseFloat(coin.priceUsd).toFixed(2)}</p>
      <p className="text-gray-600">Market Cap: ${parseFloat(coin.marketCapUsd).toFixed(2)}</p>

      {/* Chart */}
      <div className="chart-container mt-4">
        {historicalData[coin.id] ? (
          <Line
            data={{
              labels: historicalData[coin.id].map((entry) =>
                new Date(entry.date).toLocaleDateString()
              ),
              datasets: [
                {
                  label: `${coin.name} (7D)`,
                  data: historicalData[coin.id].map((entry) => entry.price),
                  borderColor: 'blue',
                  backgroundColor: 'rgba(0, 0, 255, 0.1)',
                  fill: true,
                  tension: 0.4,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  ticks: { display: false },
                },
              },
            }}
          />
        ) : (
          <p className="text-gray-500 text-center mt-4">Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default CoinCard;
