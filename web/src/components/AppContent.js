import React, { useState, useEffect } from 'react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';
import { Link } from 'react-router-dom';
import { JsonRpcProvider, Connection } from '@mysten/sui.js';
import Header from './Header';

// Add font imports
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap');
`;

function AppContent() {
  const { account } = useWallet();
  const [activeTab, setActiveTab] = useState('New');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'CryptoArtist',
    rank: 'Gold Collector',
    profileImage: 'profile1',
    isCustomizing: false
  });
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileMenuTimeout, setProfileMenuTimeout] = useState(null);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [walletBalance, setWalletBalance] = useState('0.00');

  const tabs = ['New', 'Just Sold', 'Popular', 'Exclusive'];

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
    // Add font styles
    const style = document.createElement('style');
    style.textContent = fonts;
    document.head.appendChild(style);

    // Update theme classes for both app and wallet
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('theme-dark', isDarkMode);
    document.body.classList.toggle('theme-light', !isDarkMode);
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    // Cleanup
    return () => {
      document.head.removeChild(style);
      document.body.classList.remove('theme-dark', 'theme-light');
      document.body.removeAttribute('data-theme');
    };
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const startCustomizing = () => {
    setUserProfile(prev => ({ ...prev, isCustomizing: true }));
    setIsProfileOpen(false);
  };

  const handleProfileMenuClick = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Update wallet balance when account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          const connection = new Connection({
            fullnode: 'https://fullnode.mainnet.sui.io',
          });
          const provider = new JsonRpcProvider(connection);
          
          const balance = await provider.getBalance({
            owner: account.address,
            coinType: '0x2::sui::SUI'
          });
          
          // Convert balance from MIST to SUI (1 SUI = 1_000_000_000 MIST)
          const suiBalance = Number(balance.totalBalance) / 1_000_000_000;
          setWalletBalance(suiBalance.toFixed(4));
        } catch (error) {
          console.error('Error fetching balance:', error);
          setWalletBalance('0.00');
        }
      } else {
        setWalletBalance('0.00');
      }
    };

    fetchBalance();
    // Set up an interval to refresh the balance every 30 seconds
    const intervalId = setInterval(fetchBalance, 30000);
    
    return () => clearInterval(intervalId);
  }, [account]);

  const renderTabContent = (tab) => {
    const cardStyle = `bg-transparent overflow-hidden font-['Helvetica'] flex flex-col`;
    const imageContainerStyle = `w-full border-[25px] ${currentTheme.imageBorder} overflow-hidden`;
    const imageStyle = "w-full h-[400px] object-cover";
    const infoContainerStyle = `p-6 flex flex-col justify-between`;
    const titleStyle = `text-xl font-bold ${currentTheme.text} mb-4 tracking-wide`;
    const priceStyle = `text-xs font-semibold ${currentTheme.text} tracking-wide m-[10px]`;
    const creatorStyle = `flex items-center space-x-3 ${currentTheme.description} text-sm tracking-wide`;
    const profileImageStyle = "w-8 h-8 object-cover border-2 border-[#444444]";

    const renderCard = (imageId, title, price, creator, creatorImageId, type) => {
      const isCosmicDreams = title === 'Cosmic Dreams #1';
      const CardWrapper = isCosmicDreams ? Link : 'div';
      const wrapperProps = isCosmicDreams ? { to: '/market/1' } : {};

      return (
        <CardWrapper {...wrapperProps} className={`${cardStyle} ${isCosmicDreams ? 'cursor-pointer' : ''}`}>
          <div className={imageContainerStyle}>
            <img 
              src={`https://picsum.photos/seed/${imageId}/800/600`} 
              alt={title}
              className={imageStyle}
            />
          </div>
          <div className={infoContainerStyle}>
            <div className="flex justify-between items-start">
              <div className="flex-grow pr-2">
                <h3 className={titleStyle}>{title}</h3>
                <div className={`text-sm ${type === '1/1' ? 'text-[#00CC6A]' : 'text-[#00994D]'} mb-2`}>
                  {type}
                </div>
                <div className={creatorStyle}>
                  <img 
                    src={`https://picsum.photos/seed/profile${creatorImageId}/100/100`}
                    alt={creator}
                    className={profileImageStyle}
                  />
                  <span className="truncate">{creator}</span>
                </div>
              </div>
              <div className={priceStyle}>
                {price}
              </div>
            </div>
          </div>
        </CardWrapper>
      );
    };

    // Render content based on active tab
    const renderContent = (tab) => {
      switch(tab) {
        case 'New':
          return (
            <>
              {renderCard('new1', 'Cosmic Dreams #1', '50 SUI', 'Luna Digital', '1', '1/1')}
              {renderCard('new2', 'Digital Oasis', '75 SUI', 'Pixel Dreams', '2', 'Edition 1/10')}
              {renderCard('new3', 'Neon Nights', '45 SUI', 'Neon Artist', '3', '1/1')}
              {renderCard('new4', 'Quantum Echoes', '65 SUI', 'Quantum Creator', '4', 'Edition 2/10')}
              {renderCard('new5', 'Digital Serenity', '55 SUI', 'Zen Digital', '5', '1/1')}
              {renderCard('new6', 'Cyber Dreams', '85 SUI', 'Cyber Artist', '6', 'Edition 3/10')}
            </>
          );
        case 'Just Sold':
          return (
            <>
              {renderCard('sold1', 'Mystic Mountains', 'Sold for 120 SUI', 'Mountain Dreams', '1', '1/1')}
              {renderCard('sold2', 'Ocean Whispers', 'Sold for 95 SUI', 'Deep Blue', '2', 'Edition 1/5')}
              {renderCard('sold3', 'Urban Dreams', 'Sold for 150 SUI', 'City Artist', '3', '1/1')}
              {renderCard('sold4', 'Digital Dynasty', 'Sold for 200 SUI', 'Digital King', '4', 'Edition 2/5')}
              {renderCard('sold5', 'Abstract Reality', 'Sold for 180 SUI', 'Abstract Mind', '5', '1/1')}
              {renderCard('sold6', 'Future Visions', 'Sold for 160 SUI', 'Future Artist', '6', 'Edition 3/5')}
            </>
          );
        case 'Popular':
          return (
            <>
              {renderCard('pop1', 'Digital Dynasty', '200 SUI', 'Digital King', '4', '1/1')}
              {renderCard('pop2', 'Abstract Reality', '180 SUI', 'Abstract Mind', '5', 'Edition 1/20')}
              {renderCard('pop3', 'Future Visions', '160 SUI', 'Future Artist', '6', '1/1')}
              {renderCard('pop4', 'Cosmic Harmony', '220 SUI', 'Cosmic Artist', '1', 'Edition 2/20')}
              {renderCard('pop5', 'Digital Dreams', '190 SUI', 'Dream Weaver', '2', '1/1')}
              {renderCard('pop6', 'Neon Pulse', '170 SUI', 'Neon Pulse', '3', 'Edition 3/20')}
            </>
          );
        case 'Exclusive':
          return (
            <>
              {renderCard('excl1', 'Genesis Collection', '500 SUI', 'Genesis Artist', '1', '1/1')}
              {renderCard('excl2', 'Royal Edition', '450 SUI', 'Royal Creator', '2', 'Edition 1/3')}
              {renderCard('excl3', 'Masterpiece Series', '600 SUI', 'Master Artist', '3', '1/1')}
              {renderCard('excl4', 'Legacy Collection', '550 SUI', 'Legacy Artist', '4', 'Edition 2/3')}
              {renderCard('excl5', 'Diamond Edition', '650 SUI', 'Diamond Creator', '5', '1/1')}
              {renderCard('excl6', 'Platinum Series', '580 SUI', 'Platinum Artist', '6', 'Edition 3/3')}
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
        {/* Header Component */}
        <Header 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          currentTheme={currentTheme}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Helvetica'] mt-[140px]">
          <div className="mt-6 bg-transparent backdrop-blur-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderContent(activeTab)}
            </div>
          </div>
        </main>

        {/* Profile Customization Modal */}
        {userProfile.isCustomizing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${currentTheme.card} rounded-lg p-6 w-96 max-w-full mx-4`}>
              <h2 className="text-xl font-bold mb-4">Customize Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.text} bg-transparent`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={`https://picsum.photos/seed/${userProfile.profileImage}/100/100`}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                    />
                    <button
                      onClick={() => setUserProfile(prev => ({ ...prev, profileImage: Math.floor(Math.random() * 100) }))}
                      className={`${currentTheme.button} px-4 py-2 rounded-lg text-sm`}
                    >
                      Change Picture
                    </button>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setUserProfile(prev => ({ ...prev, isCustomizing: false }))}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setUserProfile(prev => ({ ...prev, isCustomizing: false }))}
                    className={`${currentTheme.button} px-4 py-2 rounded-lg`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return renderTabContent(activeTab);
}

export default AppContent; 