import React, { useState, useEffect } from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import './suiet-wallet-kit-custom.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Profile from './pages/Profile';
import PersonalMarket from './pages/PersonalMarket';
import AppContent from './components/AppContent';
import Collections from './pages/Collections';
import ImageDetail from './pages/ImageDetail';
import TabIndex from './pages/TabIndex';
import Footer from './components/Footer';

// Theme styles
const themeStyles = {
  dark: {
    background: 'bg-[#121212]',
    text: 'text-[#E0E0E0]',
    header: 'bg-[#121212] border-b border-[#444444]',
    card: 'bg-[#121212] border border-[#444444]',
    cardHover: 'hover:shadow-xl hover:shadow-[#00FF85]/10',
    border: 'border-[#444444]',
    imageBorder: 'border-8 border-[#1A1A1A]',
    tabActive: 'bg-[#444444] text-[#E0E0E0] rounded-lg',
    tabInactive: 'text-[#B0B0B0] hover:text-[#E0E0E0] hover:bg-[#444444]/50 rounded-lg',
    description: 'text-[#B0B0B0]',
    price: 'text-[#00FF85]',
    walletBanner: 'bg-[#121212] border border-[#444444]',
    button: 'bg-[#00FF85] hover:bg-[#00FF85]/90 text-[#121212] font-semibold',
    profileDropdown: 'bg-[#121212] border-[#444444]',
    analyticsCard: 'bg-[#121212] border border-[#444444]',
    analyticsValue: 'text-[#00FF85]',
    analyticsChange: {
      positive: 'text-[#00CC6A]',
      negative: 'text-[#FF4444]'
    }
  },
  light: {
    background: 'bg-[#e5e8f0]',
    text: 'text-[#333333]',
    header: 'bg-[#e5e8f0]',
    card: 'bg-[#e5e8f0] border border-[#333333]',
    cardHover: 'hover:shadow-xl hover:shadow-[#EB750E]/20',
    border: 'border-[#333333]',
    imageBorder: 'border-8 border-[#d2d4dc]',
    tabActive: 'bg-[#444444] text-[#e5e8f0] rounded-lg',
    tabInactive: 'text-[#888888] hover:text-[#333333] hover:bg-[#B3B3B3]/50 rounded-lg',
    description: 'text-[#888888]',
    price: 'text-[#EB750E]',
    walletBanner: 'bg-[#e5e8f0] border border-[#333333]',
    button: 'bg-[#EB750E] hover:bg-[#EB750E]/90 text-[#e5e8f0] font-semibold',
    profileDropdown: 'bg-[#e5e8f0] border-[#333333]',
    analyticsCard: 'bg-[#e5e8f0] border border-[#333333]',
    analyticsValue: 'text-[#EB750E]',
    analyticsChange: {
      positive: 'text-[#006633]',
      negative: 'text-[#FF4444]'
    }
  }
};

// Layout component that includes the Footer
function Layout({ children, isDarkMode, currentTheme }) {
  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      {children}
      <Footer currentTheme={currentTheme} />
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const currentTheme = isDarkMode ? themeStyles.dark : themeStyles.light;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('theme-dark', isDarkMode);
    document.body.classList.toggle('theme-light', !isDarkMode);
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <WalletProvider>
      <BrowserRouter>
        <Layout isDarkMode={isDarkMode} currentTheme={currentTheme}>
          <Routes>
            <Route path="/" element={<AppContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentTheme={currentTheme} />} />
            <Route path="/profile" element={<Profile isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentTheme={currentTheme} />} />
            <Route path="/market/:marketId" element={<PersonalMarket isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentTheme={currentTheme} />} />
            <Route path="/collections" element={<Collections isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentTheme={currentTheme} />} />
            <Route path="/image/:collectionId/:itemId" element={<ImageDetail isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentTheme={currentTheme} />} />
            <Route path="/tab/:tabId" element={<TabIndex isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentTheme={currentTheme} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App; 