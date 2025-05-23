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
    { id: 'new1', title: 'Cosmic Dreams #1', price: '50 SUI', creator: 'Luna Digital', creatorImage: '1', type: '1/1', image: 'new1' },
    { id: 'new2', title: 'Digital Oasis', price: '75 SUI', creator: 'Pixel Dreams', creatorImage: '2', type: 'Edition 1/10', image: 'new2' },
    { id: 'new3', title: 'Neon Nights', price: '45 SUI', creator: 'Neon Artist', creatorImage: '3', type: '1/1', image: 'new3' },
    { id: 'new4', title: 'Quantum Echoes', price: '65 SUI', creator: 'Quantum Creator', creatorImage: '4', type: 'Edition 2/10', image: 'new4' },
    { id: 'new5', title: 'Digital Serenity', price: '55 SUI', creator: 'Zen Digital', creatorImage: '5', type: '1/1', image: 'new5' },
    { id: 'new6', title: 'Cyber Dreams', price: '85 SUI', creator: 'Cyber Artist', creatorImage: '6', type: 'Edition 3/10', image: 'new6' }
  ],
  'Just Sold': [
    { id: 'sold1', title: 'Mystic Mountains', price: 'Sold for 120 SUI', creator: 'Mountain Dreams', creatorImage: '1', type: '1/1', image: 'sold1' },
    { id: 'sold2', title: 'Ocean Whispers', price: 'Sold for 95 SUI', creator: 'Deep Blue', creatorImage: '2', type: 'Edition 1/5', image: 'sold2' },
    { id: 'sold3', title: 'Urban Dreams', price: 'Sold for 150 SUI', creator: 'City Artist', creatorImage: '3', type: '1/1', image: 'sold3' },
    { id: 'sold4', title: 'Digital Dynasty', price: 'Sold for 200 SUI', creator: 'Digital King', creatorImage: '4', type: 'Edition 2/5', image: 'sold4' },
    { id: 'sold5', title: 'Abstract Reality', price: 'Sold for 180 SUI', creator: 'Abstract Mind', creatorImage: '5', type: '1/1', image: 'sold5' },
    { id: 'sold6', title: 'Future Visions', price: 'Sold for 160 SUI', creator: 'Future Artist', creatorImage: '6', type: 'Edition 3/5', image: 'sold6' }
  ],
  'Popular': [
    { id: 'pop1', title: 'Digital Dynasty', price: '200 SUI', creator: 'Digital King', creatorImage: '4', type: '1/1', image: 'pop1' },
    { id: 'pop2', title: 'Abstract Reality', price: '180 SUI', creator: 'Abstract Mind', creatorImage: '5', type: 'Edition 1/20', image: 'pop2' },
    { id: 'pop3', title: 'Future Visions', price: '160 SUI', creator: 'Future Artist', creatorImage: '6', type: '1/1', image: 'pop3' },
    { id: 'pop4', title: 'Cosmic Harmony', price: '220 SUI', creator: 'Cosmic Artist', creatorImage: '1', type: 'Edition 2/20', image: 'pop4' },
    { id: 'pop5', title: 'Digital Dreams', price: '190 SUI', creator: 'Dream Weaver', creatorImage: '2', type: '1/1', image: 'pop5' },
    { id: 'pop6', title: 'Neon Pulse', price: '170 SUI', creator: 'Neon Pulse', creatorImage: '3', type: 'Edition 3/20', image: 'pop6' }
  ],
  'Exclusive': [
    { id: 'excl1', title: 'Genesis Collection', price: '500 SUI', creator: 'Genesis Artist', creatorImage: '1', type: '1/1', image: 'excl1' },
    { id: 'excl2', title: 'Royal Edition', price: '450 SUI', creator: 'Royal Creator', creatorImage: '2', type: 'Edition 1/3', image: 'excl2' },
    { id: 'excl3', title: 'Masterpiece Series', price: '600 SUI', creator: 'Master Artist', creatorImage: '3', type: '1/1', image: 'excl3' },
    { id: 'excl4', title: 'Legacy Collection', price: '550 SUI', creator: 'Legacy Artist', creatorImage: '4', type: 'Edition 2/3', image: 'excl4' },
    { id: 'excl5', title: 'Diamond Edition', price: '650 SUI', creator: 'Diamond Creator', creatorImage: '5', type: '1/1', image: 'excl5' },
    { id: 'excl6', title: 'Platinum Series', price: '580 SUI', creator: 'Platinum Artist', creatorImage: '6', type: 'Edition 3/3', image: 'excl6' }
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
    
    // Find tab based on category
    const tab = Object.entries(tabToCategory).find(([_, cat]) => cat === category)?.[0];
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

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

  const renderCard = (item) => {
    const cardStyle = `bg-transparent overflow-hidden font-['Helvetica'] flex flex-col`;
    const imageContainerStyle = `w-full border-[25px] ${currentTheme.imageBorder} overflow-hidden`;
    const imageStyle = "w-full h-[400px] object-cover";
    const infoContainerStyle = `p-6 flex flex-col justify-between`;
    const titleStyle = `text-xl font-bold ${currentTheme.text} mb-4 tracking-wide`;
    const priceStyle = `text-xs font-semibold ${currentTheme.text} tracking-wide m-[10px]`;
    const creatorStyle = `flex items-center space-x-3 ${currentTheme.description} text-sm tracking-wide`;
    const profileImageStyle = "w-8 h-8 object-cover border-2 border-[#444444]";

    return (
      <div key={item.id} className={cardStyle}>
        <div className={imageContainerStyle}>
          <img 
            src={`https://picsum.photos/seed/${item.image}/800/600`} 
            alt={item.title}
            className={imageStyle}
          />
        </div>
        <div className={infoContainerStyle}>
          <div className="flex justify-between items-start">
            <div className="flex-grow pr-2">
              <h3 className={titleStyle}>{item.title}</h3>
              <div className={`text-sm ${item.type === '1/1' ? 'text-[#00CC6A]' : 'text-[#00994D]'} mb-2`}>
                {item.type}
              </div>
              <div className={creatorStyle}>
                <img 
                  src={`https://picsum.photos/seed/profile${item.creatorImage}/100/100`}
                  alt={item.creator}
                  className={profileImageStyle}
                />
                <span className="truncate">{item.creator}</span>
              </div>
            </div>
            <div className={priceStyle}>
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