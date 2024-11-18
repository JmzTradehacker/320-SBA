# CoinPal

CoinPal is a cryptocurrency dashboard and trading tracker. It provides live price updates, a watchlist for tracking coins, and a trade tracker to manage buy and sell trades. The application is built using React, TailwindCSS, and CoinCap API.

## Features

### Dashboard
- Add cryptocurrencies to a watchlist.
- Display live price, market cap, and a 7-day price trend chart for each coin.
- Search functionality supports:
  - Coin names (e.g., Bitcoin, bitcoin)
  - Symbols (e.g., BTC, BTC/USD)
  - Case-insensitive queries.

### Trades
- Buy and sell trades with quantity and live price tracking.
- Display details for each trade:
  - Coin (formatted as BTC/USD)
  - Quantity
  - Buy/Sell type
  - Entry price, live P/L, and trade status (Open/Closed).
- Automatic refresh of live P/L every 10 seconds.
- Close trade functionality:
  - Shows duration and calculates final P/L.
  - Color-coded trade container: 
    - **Blue** for profit.
    - **Red** for loss.
    - **Gray** for no change.

## Technologies Used
- **Frontend Framework:** React
- **Styling:** TailwindCSS
- **Charts:** Chart.js (via react-chartjs-2)
- **API:** [CoinCap API](https://coincap.io/)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd CoinPal
