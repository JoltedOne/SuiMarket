import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useWallet } from '@suiet/wallet-kit';
import Header from '../components/Header';
import { JsonRpcProvider, Connection } from '@mysten/sui.js';

// Add font imports
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap');
`;

// Tab-specific content data
const tabContent = {
  'New': [
    { id: 'new1', title: 'Cosmic Dreams #1', price: '50 SUI', creator: 'Luna Digital', creatorImage: '1', type: '1/1', image: 'new1', marketId: 'market1', collectionId: 'cosmic-dreams' },
    { id: 'new2', title: 'Digital Oasis', price: '75 SUI', creator: 'Pixel Dreams', creatorImage: '2', type: 'Edition 1/10', image: 'new2', marketId: 'market2', collectionId: 'digital-oasis' },
    { id: 'new3', title: 'Neon Nights', price: '45 SUI', creator: 'Neon Artist', creatorImage: '3', type: '1/1', image: 'new3', marketId: 'market3', collectionId: 'neon-nights' },
    { id: 'new4', title: 'Quantum Echoes', price: '65 SUI', creator: 'Quantum Creator', creatorImage: '4', type: 'Edition 2/10', image: 'new4', marketId: 'market4', collectionId: 'quantum-echoes' },
    { id: 'new5', title: 'Digital Serenity', price: '55 SUI', creator: 'Zen Digital', creatorImage: '5', type: '1/1', image: 'new5', marketId: 'market5', collectionId: 'digital-serenity' },
    { id: 'new6', title: 'Cyber Dreams', price: '85 SUI', creator: 'Cyber Artist', creatorImage: '6', type: 'Edition 3/10', image: 'new6', marketId: 'market6', collectionId: 'cyber-dreams' }
  ],
  'Just Sold': [
    { id: 'sold1', title: 'Mystic Mountains', price: 'Sold for 120 SUI', creator: 'Mountain Dreams', creatorImage: '1', type: '1/1', image: 'sold1', marketId: 'market7', collectionId: 'mystic-mountains' },
    { id: 'sold2', title: 'Ocean Whispers', price: 'Sold for 95 SUI', creator: 'Deep Blue', creatorImage: '2', type: 'Edition 1/5', image: 'sold2', marketId: 'market8', collectionId: 'ocean-whispers' },
    { id: 'sold3', title: 'Urban Dreams', price: 'Sold for 150 SUI', creator: 'City Artist', creatorImage: '3', type: '1/1', image: 'sold3', marketId: 'market9', collectionId: 'urban-dreams' },
    { id: 'sold4', title: 'Digital Dynasty', price: 'Sold for 200 SUI', creator: 'Digital King', creatorImage: '4', type: 'Edition 2/5', image: 'sold4', marketId: 'market10', collectionId: 'digital-dynasty' },
    { id: 'sold5', title: 'Abstract Reality', price: 'Sold for 180 SUI', creator: 'Abstract Mind', creatorImage: '5', type: '1/1', image: 'sold5', marketId: 'market11', collectionId: 'abstract-reality' },
    { id: 'sold6', title: 'Future Visions', price: 'Sold for 160 SUI', creator: 'Future Artist', creatorImage: '6', type: 'Edition 3/5', image: 'sold6', marketId: 'market12', collectionId: 'future-visions' }
  ],
  'Popular': [
    { id: 'pop1', title: 'Digital Dynasty', price: '200 SUI', creator: 'Digital King', creatorImage: '4', type: '1/1', image: 'pop1', marketId: 'market13', collectionId: 'digital-dynasty-pop' },
    { id: 'pop2', title: 'Abstract Reality', price: '180 SUI', creator: 'Abstract Mind', creatorImage: '5', type: 'Edition 1/20', image: 'pop2', marketId: 'market14', collectionId: 'abstract-reality-pop' },
    { id: 'pop3', title: 'Future Visions', price: '160 SUI', creator: 'Future Artist', creatorImage: '6', type: '1/1', image: 'pop3', marketId: 'market15', collectionId: 'future-visions-pop' },
    { id: 'pop4', title: 'Cosmic Harmony', price: '220 SUI', creator: 'Cosmic Artist', creatorImage: '1', type: 'Edition 2/20', image: 'pop4', marketId: 'market16', collectionId: 'cosmic-harmony' },
    { id: 'pop5', title: 'Digital Dreams', price: '190 SUI', creator: 'Dream Weaver', creatorImage: '2', type: '1/1', image: 'pop5', marketId: 'market17', collectionId: 'digital-dreams-pop' },
    { id: 'pop6', title: 'Neon Pulse', price: '170 SUI', creator: 'Neon Pulse', creatorImage: '3', type: 'Edition 3/20', image: 'pop6', marketId: 'market18', collectionId: 'neon-pulse' }
  ],
  'Exclusive': [
    { id: 'excl1', title: 'Genesis Collection', price: '500 SUI', creator: 'Genesis Artist', creatorImage: '1', type: '1/1', image: 'excl1', marketId: 'market19', collectionId: 'genesis-collection' },
    { id: 'excl2', title: 'Royal Edition', price: '450 SUI', creator: 'Royal Creator', creatorImage: '2', type: 'Edition 1/3', image: 'excl2', marketId: 'market20', collectionId: 'royal-edition' },
    { id: 'excl3', title: 'Masterpiece Series', price: '600 SUI', creator: 'Master Artist', creatorImage: '3', type: '1/1', image: 'excl3', marketId: 'market21', collectionId: 'masterpiece-series' },
    { id: 'excl4', title: 'Legacy Collection', price: '550 SUI', creator: 'Legacy Artist', creatorImage: '4', type: 'Edition 2/3', image: 'excl4', marketId: 'market22', collectionId: 'legacy-collection' },
    { id: 'excl5', title: 'Diamond Edition', price: '650 SUI', creator: 'Diamond Creator', creatorImage: '5', type: '1/1', image: 'excl5', marketId: 'market23', collectionId: 'diamond-edition' },
    { id: 'excl6', title: 'Platinum Series', price: '580 SUI', creator: 'Platinum Artist', creatorImage: '6', type: 'Edition 3/3', image: 'excl6', marketId: 'market24', collectionId: 'platinum-series' }
  ]
};

function TabIndex() {
  const { account } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('New');

  // Map tabs to categories for URL parameters
  const tabToCategory = {
    'New': 'featured',
    'Just Sold': 'just-sold',
    'Popular': 'popular',
    'Exclusive': 'exclusive'
  };

  // Map categories to tabs for reverse lookup
  const categoryToTab = Object.entries(tabToCategory).reduce((acc, [tab, category]) => {
    acc[category] = tab;
    return acc;
  }, {});

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const category = tabToCategory[tab];
    navigate(`/tabindex?category=${category}`, { replace: true });
  };

  // Sync tab with URL parameters on mount and URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    
    if (category && categoryToTab[category]) {
      setActiveTab(categoryToTab[category]);
    } else {
      // If no valid category in URL, default to 'New'
      setActiveTab('New');
      navigate('/tabindex?category=featured', { replace: true });
    }
  }, [location.search, navigate]);

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

  const handleCardClick = (item, event) => {
    // Navigate to personal market for both image and card clicks
    const marketClass = `market-${item.marketId}`;
    const collectionClass = `collection-${item.collectionId}`;
    const itemClass = `item-${item.id}`;

    navigate(`/market/${item.marketId}`, {
      state: {
        itemData: item,
        marketId: item.marketId,
        collectionId: item.collectionId,
        marketClass,
        collectionClass,
        itemClass,
        itemDetails: {
          id: item.id,
          title: item.title,
          price: item.price,
          creator: item.creator,
          type: item.type,
          image: item.image
        }
      }
    });
  };

  const renderCard = (item) => {
    const cardStyle = `bg-transparent overflow-hidden font-['Helvetica'] flex flex-col ${currentTheme.cardHover} cursor-pointer transition-transform duration-300 hover:scale-105`;
    const imageContainerStyle = `w-full border-[25px] ${currentTheme.imageBorder} overflow-hidden relative market-image-container`;
    const imageStyle = "w-full h-[400px] object-cover market-image";
    const infoContainerStyle = "p-6 flex flex-col justify-between market-info";
    const titleStyle = `text-xl font-bold ${currentTheme.text} mb-4 tracking-wide market-title`;
    const priceStyle = `text-xs font-semibold ${currentTheme.price} tracking-wide m-[10px] market-price`;
    const creatorStyle = `flex items-center space-x-3 ${currentTheme.description} text-sm tracking-wide market-creator`;
    const profileImageStyle = "w-8 h-8 object-cover border-2 border-[#444444] market-profile-image";
    const typeStyle = `text-sm ${item.type === '1/1' ? 'text-[#00CC6A]' : 'text-[#00994D]'} mb-2 market-type`;

    // Generate unique market-related classes
    const marketClass = `market-${item.marketId}`;
    const collectionClass = `collection-${item.collectionId}`;
    const itemClass = `item-${item.id}`;
    const marketImageClass = `market-image-${item.marketId}`;
    const marketCardClass = `market-card-${item.marketId}`;

    return (
      <div 
        key={item.id}
        className={`${cardStyle} ${marketClass} ${collectionClass} ${itemClass} ${marketCardClass} market-card`}
        onClick={(e) => handleCardClick(item, e)}
        data-item-id={item.id}
        data-collection-id={item.collectionId}
        data-market-id={item.marketId}
        data-market-class={marketClass}
        data-collection-class={collectionClass}
        data-item-class={itemClass}
      >
        <div className={`${imageContainerStyle} ${marketImageClass} market-image-wrapper`}>
          <img 
            src={`https://picsum.photos/seed/${item.image}/800/600`}
            alt={item.title}
            className={`${imageStyle} ${marketImageClass} market-image-content`}
            loading="lazy"
            data-image-id={item.image}
            data-market-image={marketImageClass}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300 market-image-overlay" />
        </div>
        <div className={`${infoContainerStyle} market-info-container`}>
          <div className="flex justify-between items-start">
            <div className="flex-grow pr-2">
              <h3 className={`${titleStyle} market-title-text`}>{item.title}</h3>
              <div className={`${typeStyle} market-type-text`}>
                {item.type}
              </div>
              <div className={`${creatorStyle} market-creator-info`}>
                <img 
                  src={`https://picsum.photos/seed/profile${item.creatorImage}/100/100`}
                  alt={item.creator}
                  className={`${profileImageStyle} market-creator-image`}
                  loading="lazy"
                  data-creator-id={item.creatorImage}
                />
                <span className={`truncate market-creator-name`}>{item.creator}</span>
              </div>
            </div>
            <div className={`${priceStyle} market-price-tag`}>
              {item.price}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      {/* Header Component */}
      <Header 
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        currentTheme={currentTheme}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Helvetica'] mt-[140px]">
        <div className="mt-6 bg-transparent backdrop-blur-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tabContent[activeTab]?.map(item => renderCard(item))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TabIndex; 