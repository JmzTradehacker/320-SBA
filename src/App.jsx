import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Trades from './components/Trades';

function App() {
  return (
    <Router>
      <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">CoinPal</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/trades" className="hover:underline">
            Trades
          </Link>
        </div>
      </nav>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trades" element={<Trades />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
