import React, { useState } from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import './suiet-wallet-kit-custom.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile';
import PersonalMarket from './pages/PersonalMarket';
import AppContent from './components/AppContent';
import Collections from './pages/Collections';
import ImageDetail from './pages/ImageDetail';
import TabIndex from './pages/TabIndex';
import Footer from './components/Footer';

// Layout component that includes the Footer
function Layout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Theme styles
  const themeStyles = {
    dark: {
      background: 'bg-[#121212]',
      text: 'text-[#E0E0E0]',
      border: 'border-[#444444]'
    },
    light: {
      background: 'bg-[#e5e8f0]',
      text: 'text-[#333333]',
      border: 'border-[#333333]'
    }
  };

  const currentTheme = isDarkMode ? themeStyles.dark : themeStyles.light;

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      {children}
      <Footer currentTheme={currentTheme} />
    </div>
  );
}

// Main App component
function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/market/:collectionId" element={<PersonalMarket />} />
            <Route path="/collections/:collectionId" element={<Collections />} />
            <Route path="/collections/:collectionId/item/:itemId" element={<ImageDetail />} />
            <Route path="/tabindex" element={<TabIndex />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App; 