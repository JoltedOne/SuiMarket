import React, { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { JsonRpcProvider, Connection } from '@mysten/sui.js';

// Add font imports
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap');
`;

// Sample analytics data for market items
const marketAnalyticsData = {
  market1: {
    floorPrice: '50 SUI',
    floorChange: '+5.2%',
    volume24h: '1,250 SUI',
    volumeChange: '+12.3%',
    owners: 45,
    ownersChange: '+3',
    items: 100,
    itemsChange: '+5'
  },
  market2: {
    floorPrice: '75 SUI',
    floorChange: '+8.7%',
    volume24h: '2,500 SUI',
    volumeChange: '+15.6%',
    owners: 78,
    ownersChange: '+12',
    items: 150,
    itemsChange: '+8'
  }
  // Add more market analytics as needed
};

function PersonalMarket({ isDarkMode, toggleTheme, currentTheme }) {
  const { account } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const { marketId } = useParams();
  const [activeTab, setActiveTab] = useState('Listings');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsWidth, setAnalyticsWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [itemData, setItemData] = useState(null);
  const [currentAnalytics, setCurrentAnalytics] = useState(null);

  // Add drag handlers for analytics panel
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartWidth(analyticsWidth);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    e.preventDefault();
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const deltaX = startX - e.clientX;
    const newWidth = Math.min(Math.max(startWidth + deltaX, 200), 600);
    setAnalyticsWidth(newWidth);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // Add useEffect for drag handlers cleanup
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  // Load item data from location state
  useEffect(() => {
    if (location.state?.itemData) {
      setItemData(location.state.itemData);
      setCurrentAnalytics(marketAnalyticsData[marketId] || null);
    }
  }, [location.state, marketId]);

  // Function to render analytics cards
  const renderAnalyticsCards = () => {
    if (!currentAnalytics) return null;

    const analyticsItems = [
      { label: 'Floor Price', value: currentAnalytics.floorPrice, change: currentAnalytics.floorChange },
      { label: '24h Volume', value: currentAnalytics.volume24h, change: currentAnalytics.volumeChange },
      { label: 'Owners', value: currentAnalytics.owners, change: currentAnalytics.ownersChange },
      { label: 'Items', value: currentAnalytics.items, change: currentAnalytics.itemsChange }
    ];

    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {analyticsItems.map((item, index) => (
          <div key={index} className={`${currentTheme.analyticsCard} rounded-lg p-4`}>
            <p className={`text-sm ${currentTheme.description}`}>{item.label}</p>
            <p className={`text-lg font-bold ${currentTheme.analyticsValue}`}>{item.value}</p>
            <p className={`text-sm ${item.change.startsWith('+') ? currentTheme.analyticsChange.positive : currentTheme.analyticsChange.negative}`}>
              {item.change}
            </p>
          </div>
        ))}
      </div>
    );
  };

  if (!itemData) {
    return null; // or a loading spinner
  }

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        currentTheme={currentTheme}
        isAnalyticsOpen={isAnalyticsOpen}
        setIsAnalyticsOpen={setIsAnalyticsOpen}
        analyticsWidth={analyticsWidth}
        handleDragStart={handleDragStart}
        renderAnalyticsCards={renderAnalyticsCards}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Helvetica'] mt-[140px]">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Section */}
          <div className="lg:w-2/3">
            <div className={`${currentTheme.card} rounded-lg overflow-hidden`}>
              <div className={`w-full border-[25px] ${currentTheme.imageBorder} overflow-hidden`}>
                <img 
                  src={`https://picsum.photos/seed/${itemData.image}/1200/800`}
                  alt={itemData.title}
                  className="w-full h-[600px] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/3">
            <div className={`${currentTheme.card} rounded-lg p-6 space-y-6`}>
              {/* Back Button Container */}
              <div className="flex justify-end">
                <button 
                  onClick={() => navigate(-1)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${currentTheme.card} ${currentTheme.text} hover:opacity-80 transition-opacity duration-300`}
                  aria-label="Back to Previous"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                    />
                  </svg>
                </button>
              </div>

              <div className="pt-4">
                <h1 className={`text-3xl font-bold ${currentTheme.text} mb-2`}>{itemData.title}</h1>
                <p className={`text-sm ${currentTheme.description}`}>Market ID: {marketId}</p>
              </div>

              <div className="flex items-center space-x-4">
                <img 
                  src={`https://picsum.photos/seed/profile${itemData.creatorImage}/100/100`}
                  alt={itemData.creator}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#444444]"
                />
                <div>
                  <p className={`text-sm ${currentTheme.description}`}>Creator</p>
                  <p className={`font-semibold ${currentTheme.text}`}>{itemData.creator}</p>
                </div>
              </div>

              <div>
                <p className={`text-sm ${currentTheme.description} mb-2`}>Type</p>
                <p className={`text-lg ${itemData.type === '1/1' ? 'text-[#00CC6A]' : 'text-[#00994D]'}`}>
                  {itemData.type}
                </p>
              </div>

              <div>
                <p className={`text-sm ${currentTheme.description} mb-2`}>Price</p>
                <p className={`text-2xl font-bold ${currentTheme.price}`}>{itemData.price}</p>
              </div>

              <button 
                className={`w-full py-3 rounded-lg ${currentTheme.button} transition-colors duration-300`}
              >
                Buy Now
              </button>

              {/* Market-specific tabs */}
              <div className="flex space-x-4 mt-6">
                {['Listings', 'Offers', 'History'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-300
                      ${activeTab === tab
                        ? `${currentTheme.tabActive} ${currentTheme.text}`
                        : `${currentTheme.tabInactive} hover:shadow-lg ${isDarkMode ? 'hover:shadow-[#00FF85]/20' : 'hover:shadow-[#EB750E]/20'}`
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === 'Listings' && (
                  <div className={`${currentTheme.card} rounded-lg p-4`}>
                    <p className={`text-sm ${currentTheme.description}`}>Current listings will appear here</p>
                  </div>
                )}
                {activeTab === 'Offers' && (
                  <div className={`${currentTheme.card} rounded-lg p-4`}>
                    <p className={`text-sm ${currentTheme.description}`}>Active offers will appear here</p>
                  </div>
                )}
                {activeTab === 'History' && (
                  <div className={`${currentTheme.card} rounded-lg p-4`}>
                    <p className={`text-sm ${currentTheme.description}`}>Transaction history will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PersonalMarket; 