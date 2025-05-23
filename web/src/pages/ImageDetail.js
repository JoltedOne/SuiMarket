import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@suiet/wallet-kit';
import Header from '../components/Header';
import { JsonRpcProvider, Connection } from '@mysten/sui.js';

// Add font imports
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap');
`;

// Sample analytics data for all images
const analyticsData = {
  new1: {
    floorPrice: '50 SUI',
    floorChange: '+5.2%',
    volume24h: '1,250 SUI',
    volumeChange: '+12.3%',
    owners: 45,
    ownersChange: '+3',
    items: 100,
    itemsChange: '+5'
  },
  new2: {
    floorPrice: '75 SUI',
    floorChange: '+8.7%',
    volume24h: '2,500 SUI',
    volumeChange: '+15.6%',
    owners: 78,
    ownersChange: '+12',
    items: 150,
    itemsChange: '+8'
  },
  new3: {
    floorPrice: '120 SUI',
    floorChange: '+12.4%',
    volume24h: '3,800 SUI',
    volumeChange: '+18.9%',
    owners: 92,
    ownersChange: '+15',
    items: 200,
    itemsChange: '+10'
  },
  new4: {
    floorPrice: '95 SUI',
    floorChange: '+7.8%',
    volume24h: '2,900 SUI',
    volumeChange: '+14.2%',
    owners: 85,
    ownersChange: '+8',
    items: 175,
    itemsChange: '+7'
  },
  new5: {
    floorPrice: '150 SUI',
    floorChange: '+15.3%',
    volume24h: '4,500 SUI',
    volumeChange: '+22.1%',
    owners: 105,
    ownersChange: '+20',
    items: 225,
    itemsChange: '+12'
  },
  new6: {
    floorPrice: '180 SUI',
    floorChange: '+18.6%',
    volume24h: '5,200 SUI',
    volumeChange: '+25.4%',
    owners: 120,
    ownersChange: '+25',
    items: 250,
    itemsChange: '+15'
  }
};

function ImageDetail() {
  const { collectionId, itemId } = useParams();
  const navigate = useNavigate();
  const { account } = useWallet();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('New');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsWidth, setAnalyticsWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [item, setItem] = useState(null);
  const [collection, setCollection] = useState(null);
  const [currentAnalytics, setCurrentAnalytics] = useState(null);

  // Theme styles (complete version)
  const themeStyles = {
    dark: {
      background: 'bg-[#121212]',
      text: 'text-[#E0E0E0]',
      header: 'bg-[#121212] border-b border-[#444444]',
      card: 'bg-[#121212]',
      cardHover: 'hover:shadow-xl hover:shadow-[#00FF85]/10',
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
      },
      settingsDropdown: 'bg-[#121212] border-[#444444]'
    },
    light: {
      background: 'bg-[#e5e8f0]',
      text: 'text-[#333333]',
      header: 'bg-[#e5e8f0]',
      card: 'bg-[#e5e8f0] ',
      cardHover: 'hover:shadow-xl hover:shadow-[#EB750E]/20',
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
      },
      settingsDropdown: 'bg-[#e5e8f0] border-[#333333]'
    }
  };

  const currentTheme = isDarkMode ? themeStyles.dark : themeStyles.light;

  // Add font styles to document
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = fonts;
    document.head.appendChild(style);

    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('theme-dark', isDarkMode);
    document.body.classList.toggle('theme-light', !isDarkMode);
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    return () => {
      document.head.removeChild(style);
      document.body.classList.remove('theme-dark', 'theme-light');
      document.body.removeAttribute('data-theme');
    };
  }, [isDarkMode]);

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
    const newWidth = Math.min(Math.max(startWidth + deltaX, 200), 600); // Min 200px, max 600px
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

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the same sample data structure
    const collectionsData = {
      1: {
        name: 'Cosmic Dreams #1',
        creator: 'Luna Digital',
        items: [
          { id: 1, name: 'Cosmic Dreams #1', price: '50 SUI', creator: 'Luna Digital', image: 'new1', type: '1/1' },
          { id: 2, name: 'Digital Oasis', price: '75 SUI', creator: 'Pixel Dreams', image: 'new2', type: 'Edition 1/10' },
          { id: 3, name: 'Neon Nights', price: '120 SUI', creator: 'Cyber Artist', image: 'new3', type: '1/1' },
          { id: 4, name: 'Abstract Dreams', price: '95 SUI', creator: 'Digital Vision', image: 'new4', type: 'Edition 1/5' },
          { id: 5, name: 'Cosmic Journey', price: '150 SUI', creator: 'Star Creator', image: 'new5', type: '1/1' },
          { id: 6, name: 'Digital Universe', price: '180 SUI', creator: 'Space Artist', image: 'new6', type: 'Edition 1/3' }
        ]
      }
    };

    const foundCollection = collectionsData[collectionId];
    if (foundCollection) {
      setCollection(foundCollection);
      const foundItem = foundCollection.items.find(i => i.image === itemId);
      if (foundItem) {
        setItem(foundItem);
        // Set analytics data for the current image
        setCurrentAnalytics(analyticsData[foundItem.image] || null);
      } else {
        navigate(`/collections/${collectionId}`);
      }
    } else {
      navigate('/profile');
    }
  }, [collectionId, itemId, navigate]);

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

  if (!item || !collection) {
    return null; // or a loading spinner
  }

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
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
                  src={`https://picsum.photos/seed/${item.image}/1200/800`}
                  alt={item.name}
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
                  onClick={() => navigate(`/collections/${collectionId}`)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${currentTheme.card} ${currentTheme.text} hover:opacity-80 transition-opacity duration-300`}
                  aria-label="Back to Collection"
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
                <h1 className={`text-3xl font-bold ${currentTheme.text} mb-2`}>{item.name}</h1>
                <p className={`text-sm ${currentTheme.description}`}>From Collection: {collection.name}</p>
              </div>

              <div className="flex items-center space-x-4">
                <img 
                  src={`https://picsum.photos/seed/profile${item.id}/100/100`}
                  alt={item.creator}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#444444]"
                />
                <div>
                  <p className={`text-sm ${currentTheme.description}`}>Creator</p>
                  <p className={`font-semibold ${currentTheme.text}`}>{item.creator}</p>
                </div>
              </div>

              <div>
                <p className={`text-sm ${currentTheme.description} mb-2`}>Type</p>
                <p className={`text-lg ${item.type === '1/1' ? 'text-[#00CC6A]' : 'text-[#00994D]'}`}>
                  {item.type}
                </p>
              </div>

              <div>
                <p className={`text-sm ${currentTheme.description} mb-2`}>Price</p>
                <p className={`text-2xl font-bold ${currentTheme.price}`}>{item.price}</p>
              </div>

              <button 
                className={`w-full py-3 rounded-lg ${currentTheme.button} transition-colors duration-300`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ImageDetail; 