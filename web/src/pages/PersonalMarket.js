import React, { useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { useParams, useNavigate } from 'react-router-dom';

function PersonalMarket() {
  const { account } = useWallet();
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('Listings');

  const tabs = ['Listings', 'Offers', 'History'];

  const themeStyles = {
    dark: {
      background: 'bg-[#121212]',
      text: 'text-[#E0E0E0]',
      card: 'bg-[#121212] border border-[#444444]',
      tabActive: 'bg-[#444444] text-[#E0E0E0] rounded-lg',
      tabInactive: 'text-[#B0B0B0] hover:text-[#E0E0E0] hover:bg-[#444444]/50 rounded-lg',
      value: 'text-[#00FF85]',
      border: 'border-[#444444]'
    },
    light: {
      background: 'bg-[#e5e8f0]',
      text: 'text-[#333333]',
      card: 'bg-[#e5e8f0] border border-[#333333]',
      tabActive: 'bg-[#444444] text-[#e5e8f0] rounded-lg',
      tabInactive: 'text-[#888888] hover:text-[#333333] hover:bg-[#B3B3B3]/50 rounded-lg',
      value: 'text-[#EB750E]',
      border: 'border-[#333333]'
    }
  };

  const currentTheme = isDarkMode ? themeStyles.dark : themeStyles.light;

  const renderTabContent = (tab) => {
    switch(tab) {
      case 'Listings':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className={`${currentTheme.card} rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'hover:shadow-[#00FF85]/10' : 'hover:shadow-[#EB750E]/20'}`}>
                <div className="relative">
                  <img 
                    src={`https://picsum.photos/seed/market${item}/800/600`}
                    alt={`Market Item ${item}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {item === 1 ? '1/1' : `Edition ${item}/10`}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className={`text-lg font-bold ${currentTheme.text} mb-2`}>Market Item {item}</h3>
                  <p className={`text-sm ${currentTheme.value} mb-2`}>{item * 75} SUI</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={`https://picsum.photos/seed/seller${item}/100/100`}
                        alt="Seller"
                        className="w-6 h-6 rounded-full"
                      />
                      <span className={`text-sm ${currentTheme.text}`}>Seller {item}</span>
                    </div>
                    <button 
                      className={`px-4 py-2 rounded-lg ${currentTheme.value} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300`}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'Offers':
        return (
          <div className="text-center py-8">
            <p className={`text-lg ${currentTheme.text}`}>Active offers will appear here</p>
          </div>
        );
      case 'History':
        return (
          <div className="text-center py-8">
            <p className={`text-lg ${currentTheme.text}`}>Transaction history will appear here</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`${currentTheme.card} rounded-lg p-6 mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg ${currentTheme.card} hover:shadow-lg transition-all duration-300`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold">Collection {collectionId}</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
          
          {/* Collection Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`${currentTheme.card} rounded-lg p-4`}>
              <h3 className="text-sm opacity-75 mb-2">Floor Price</h3>
              <p className={`text-2xl font-bold ${currentTheme.value}`}>75 SUI</p>
            </div>
            <div className={`${currentTheme.card} rounded-lg p-4`}>
              <h3 className="text-sm opacity-75 mb-2">Total Volume</h3>
              <p className={`text-2xl font-bold ${currentTheme.value}`}>1,250 SUI</p>
            </div>
            <div className={`${currentTheme.card} rounded-lg p-4`}>
              <h3 className="text-sm opacity-75 mb-2">Items Listed</h3>
              <p className={`text-2xl font-bold ${currentTheme.value}`}>24</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap py-2 px-4 text-xl font-['Teko'] tracking-wide rounded-lg transition-all duration-300
                  ${activeTab === tab
                    ? `${currentTheme.tabActive} ${currentTheme.text}`
                    : `${currentTheme.tabInactive} hover:shadow-lg ${isDarkMode ? 'hover:shadow-[#00FF85]/20' : 'hover:shadow-[#EB750E]/20'} hover:scale-105`
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="mt-6">
            {renderTabContent(activeTab)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalMarket; 