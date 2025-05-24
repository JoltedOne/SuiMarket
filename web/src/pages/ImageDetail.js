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

function ImageDetail({ isDarkMode, toggleTheme, currentTheme }) {
  const { collectionId, itemId } = useParams();
  const navigate = useNavigate();
  const { account } = useWallet();
  const [activeTab, setActiveTab] = useState('New');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsWidth, setAnalyticsWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [item, setItem] = useState(null);
  const [collection, setCollection] = useState(null);
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
          { id: 2, name: 'Cosmic Dreams #2', price: '55 SUI', creator: 'Luna Digital', image: 'new1-2', type: '1/1' },
          { id: 3, name: 'Cosmic Dreams #3', price: '60 SUI', creator: 'Luna Digital', image: 'new1-3', type: '1/1' },
          { id: 4, name: 'Cosmic Dreams #4', price: '65 SUI', creator: 'Luna Digital', image: 'new1-4', type: '1/1' },
          { id: 5, name: 'Cosmic Dreams #5', price: '70 SUI', creator: 'Luna Digital', image: 'new1-5', type: '1/1' },
          { id: 6, name: 'Cosmic Dreams #6', price: '75 SUI', creator: 'Luna Digital', image: 'new1-6', type: '1/1' }
        ]
      },
      2: {
        name: 'Digital Oasis',
        creator: 'Pixel Dreams',
        items: [
          { id: 1, name: 'Digital Oasis #1', price: '75 SUI', creator: 'Pixel Dreams', image: 'new2', type: 'Edition 1/10' },
          { id: 2, name: 'Digital Oasis #2', price: '80 SUI', creator: 'Pixel Dreams', image: 'new2-2', type: 'Edition 2/10' },
          { id: 3, name: 'Digital Oasis #3', price: '85 SUI', creator: 'Pixel Dreams', image: 'new2-3', type: 'Edition 3/10' },
          { id: 4, name: 'Digital Oasis #4', price: '90 SUI', creator: 'Pixel Dreams', image: 'new2-4', type: 'Edition 4/10' },
          { id: 5, name: 'Digital Oasis #5', price: '95 SUI', creator: 'Pixel Dreams', image: 'new2-5', type: 'Edition 5/10' },
          { id: 6, name: 'Digital Oasis #6', price: '100 SUI', creator: 'Pixel Dreams', image: 'new2-6', type: 'Edition 6/10' }
        ]
      },
      3: {
        name: 'Neon Nights',
        creator: 'Neon Artist',
        items: [
          { id: 1, name: 'Neon Nights #1', price: '45 SUI', creator: 'Neon Artist', image: 'new3', type: '1/1' },
          { id: 2, name: 'Neon Nights #2', price: '50 SUI', creator: 'Neon Artist', image: 'new3-2', type: '1/1' },
          { id: 3, name: 'Neon Nights #3', price: '55 SUI', creator: 'Neon Artist', image: 'new3-3', type: '1/1' },
          { id: 4, name: 'Neon Nights #4', price: '60 SUI', creator: 'Neon Artist', image: 'new3-4', type: '1/1' },
          { id: 5, name: 'Neon Nights #5', price: '65 SUI', creator: 'Neon Artist', image: 'new3-5', type: '1/1' },
          { id: 6, name: 'Neon Nights #6', price: '70 SUI', creator: 'Neon Artist', image: 'new3-6', type: '1/1' }
        ]
      },
      4: {
        name: 'Quantum Echoes',
        creator: 'Quantum Creator',
        items: [
          { id: 1, name: 'Quantum Echoes #1', price: '65 SUI', creator: 'Quantum Creator', image: 'new4', type: 'Edition 2/10' },
          { id: 2, name: 'Quantum Echoes #2', price: '70 SUI', creator: 'Quantum Creator', image: 'new4-2', type: 'Edition 3/10' },
          { id: 3, name: 'Quantum Echoes #3', price: '75 SUI', creator: 'Quantum Creator', image: 'new4-3', type: 'Edition 4/10' },
          { id: 4, name: 'Quantum Echoes #4', price: '80 SUI', creator: 'Quantum Creator', image: 'new4-4', type: 'Edition 5/10' },
          { id: 5, name: 'Quantum Echoes #5', price: '85 SUI', creator: 'Quantum Creator', image: 'new4-5', type: 'Edition 6/10' },
          { id: 6, name: 'Quantum Echoes #6', price: '90 SUI', creator: 'Quantum Creator', image: 'new4-6', type: 'Edition 7/10' }
        ]
      },
      5: {
        name: 'Digital Serenity',
        creator: 'Zen Digital',
        items: [
          { id: 1, name: 'Digital Serenity #1', price: '55 SUI', creator: 'Zen Digital', image: 'new5', type: '1/1' },
          { id: 2, name: 'Digital Serenity #2', price: '60 SUI', creator: 'Zen Digital', image: 'new5-2', type: '1/1' },
          { id: 3, name: 'Digital Serenity #3', price: '65 SUI', creator: 'Zen Digital', image: 'new5-3', type: '1/1' },
          { id: 4, name: 'Digital Serenity #4', price: '70 SUI', creator: 'Zen Digital', image: 'new5-4', type: '1/1' },
          { id: 5, name: 'Digital Serenity #5', price: '75 SUI', creator: 'Zen Digital', image: 'new5-5', type: '1/1' },
          { id: 6, name: 'Digital Serenity #6', price: '80 SUI', creator: 'Zen Digital', image: 'new5-6', type: '1/1' }
        ]
      },
      6: {
        name: 'Cyber Dreams',
        creator: 'Cyber Artist',
        items: [
          { id: 1, name: 'Cyber Dreams #1', price: '85 SUI', creator: 'Cyber Artist', image: 'new6', type: 'Edition 3/10' },
          { id: 2, name: 'Cyber Dreams #2', price: '90 SUI', creator: 'Cyber Artist', image: 'new6-2', type: 'Edition 4/10' },
          { id: 3, name: 'Cyber Dreams #3', price: '95 SUI', creator: 'Cyber Artist', image: 'new6-3', type: 'Edition 5/10' },
          { id: 4, name: 'Cyber Dreams #4', price: '100 SUI', creator: 'Cyber Artist', image: 'new6-4', type: 'Edition 6/10' },
          { id: 5, name: 'Cyber Dreams #5', price: '105 SUI', creator: 'Cyber Artist', image: 'new6-5', type: 'Edition 7/10' },
          { id: 6, name: 'Cyber Dreams #6', price: '110 SUI', creator: 'Cyber Artist', image: 'new6-6', type: 'Edition 8/10' }
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