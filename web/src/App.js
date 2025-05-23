import React from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import './suiet-wallet-kit-custom.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile';
import PersonalMarket from './pages/PersonalMarket';
import AppContent from './components/AppContent';
import Collections from './pages/Collections';

// Main App component
function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/market/:collectionId" element={<PersonalMarket />} />
          <Route path="/collections/:collectionId" element={<Collections />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App; 