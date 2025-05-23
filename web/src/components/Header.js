import React, { useState, useEffect } from 'react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';
import { Link, useNavigate } from 'react-router-dom';
import { JsonRpcProvider, Connection } from '@mysten/sui.js';

function Header({ activeTab, setActiveTab, isDarkMode, toggleTheme, currentTheme }) {
  const { account } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsWidth, setAnalyticsWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: 'CryptoArtist',
    rank: 'Gold Collector',
    profileImage: 'profile1',
    isCustomizing: false
  });
  const [walletBalance, setWalletBalance] = useState('0.00');
  const navigate = useNavigate();

  const tabs = [
    { name: 'New', path: '/tabindex' },
    { name: 'Just Sold', path: '/tabindex' },
    { name: 'Popular', path: '/tabindex' },
    { name: 'Exclusive', path: '/tabindex' }
  ];

  // Function to abbreviate wallet address
  const abbreviateAddress = (address) => {
    if (!address) return 'Not Connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileMenuClick = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Add click outside handler for profile menu
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

  // Add analytics rendering function
  const renderAnalyticsCard = (title, value, change) => {
    // Default colors for analytics change if not provided in theme
    const positiveColor = currentTheme.analyticsChange?.positive || (isDarkMode ? 'text-[#00CC6A]' : 'text-[#006633]');
    const negativeColor = currentTheme.analyticsChange?.negative || 'text-[#FF4444]';
    
    return (
      <div className={`${currentTheme.analyticsCard} p-6 rounded-lg mb-4`}>
        <h3 className={`text-lg font-semibold mb-2 ${currentTheme.text}`}>{title}</h3>
        <div className={`text-2xl font-bold mb-2 ${currentTheme.analyticsValue}`}>{value}</div>
        <div className={`text-sm ${change >= 0 ? positiveColor : negativeColor}`}>
          {change >= 0 ? '+' : ''}{change}%
        </div>
      </div>
    );
  };

  const renderAnalytics = (tab) => {
    switch(tab) {
      case 'New':
        return (
          <div className="space-y-4">
            {renderAnalyticsCard('Total Volume', '1,250 SUI', 15)}
            {renderAnalyticsCard('Floor Price', '45 SUI', 8)}
            {renderAnalyticsCard('Listed Items', '156', -3)}
          </div>
        );
      case 'Just Sold':
        return (
          <div className="space-y-4">
            {renderAnalyticsCard('Sales Volume', '2,800 SUI', 25)}
            {renderAnalyticsCard('Average Price', '93 SUI', 12)}
            {renderAnalyticsCard('Sales Count', '30', 20)}
          </div>
        );
      case 'Popular':
        return (
          <div className="space-y-4">
            {renderAnalyticsCard('Total Views', '45.2K', 35)}
            {renderAnalyticsCard('Unique Visitors', '12.8K', 28)}
            {renderAnalyticsCard('Engagement Rate', '8.5%', 15)}
          </div>
        );
      case 'Exclusive':
        return (
          <div className="space-y-4">
            {renderAnalyticsCard('Collection Value', '15.2K SUI', 42)}
            {renderAnalyticsCard('Rarity Score', '9.8', 5)}
            {renderAnalyticsCard('Holder Count', '48', 12)}
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    const category = tabToCategory[tab.name];
    navigate(`/tabindex?category=${category}`);
  };

  // Map tabs to categories for URL parameters
  const tabToCategory = {
    'New': 'featured',
    'Just Sold': 'just-sold',
    'Popular': 'popular',
    'Exclusive': 'exclusive'
  };

  return (
    <header className={`fixed top-0 left-0 right-0 ${currentTheme.header} shadow-md z-[5] transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row with logo and buttons */}
        <div className="py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold tracking-wider font-['Orbitron'] transition-all duration-300">
                  <svg
                    className="h-[40px] w-auto" 
                    viewBox="0 0 273.06 66.18"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ background: 'transparent' }}
                  >
                    <defs>
                      <style>
                        {`
                          svg {
                            background: transparent !important;
                          }
                          .cls-1 {
                            font-family: Orbitron, sans-serif;
                            font-size: 60px;
                            fill: ${isDarkMode ? '#E0E0E0' : '#333333'};
                            background: transparent !important;
                            filter: ${isDarkMode ? 'drop-shadow(0 0 2px rgba(0, 255, 133, 0.3))' : 'drop-shadow(0 0 2px rgba(235, 117, 14, 0.3))'};
                          }
                          .cls-2 { letter-spacing: -.01em; }
                          .cls-3 { letter-spacing: 0em; }
                          .cls-4 { letter-spacing: -.02em; }
                          text {
                            background: transparent !important;
                          }
                          tspan {
                            background: transparent !important;
                          }
                          @keyframes glow {
                            0% { filter: ${isDarkMode ? 'drop-shadow(0 0 2px rgba(0, 255, 133, 0.3))' : 'drop-shadow(0 0 2px rgba(235, 117, 14, 0.3))'}; }
                            50% { filter: ${isDarkMode ? 'drop-shadow(0 0 4px rgba(0, 255, 133, 0.5))' : 'drop-shadow(0 0 4px rgba(235, 117, 14, 0.5))'}; }
                            100% { filter: ${isDarkMode ? 'drop-shadow(0 0 2px rgba(0, 255, 133, 0.3))' : 'drop-shadow(0 0 2px rgba(235, 117, 14, 0.3))'}; }
                          }
                          .cls-1 {
                            animation: glow 3s ease-in-out infinite;
                          }
                        `}
                      </style>
                    </defs>
                    <g style={{ background: 'transparent !important' }}>
                      <text className="cls-1" transform="translate(0 51.6)" style={{ background: 'transparent !important' }}>
                        <tspan x="0" y="0" style={{ background: 'transparent !important' }}>M</tspan>
                        <tspan className="cls-2" x="55.68" y="0" style={{ background: 'transparent !important' }}>on</tspan>
                        <tspan className="cls-4" x="137.16" y="0" style={{ background: 'transparent !important' }}>o</tspan>
                        <tspan x="177.48" y="0" style={{ background: 'transparent !important' }}>li</tspan>
                        <tspan className="cls-3" x="208.08" y="0" style={{ background: 'transparent !important' }}>t</tspan>
                        <tspan x="232.98" y="0" style={{ background: 'transparent !important' }}>h</tspan>
                      </text>
                    </g>
                  </svg>
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Analytics Button */}
              <button
                onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                className={`p-2 rounded-lg ${currentTheme.card} ${currentTheme.cardHover}`}
                aria-label="Toggle analytics"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${currentTheme.card} ${currentTheme.cardHover}`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Profile Button with Menu */}
              <div className="relative profile-menu-container">
                <button
                  onClick={handleProfileMenuClick}
                  className={`p-2 rounded-lg ${currentTheme.card} ${currentTheme.cardHover} transition-all duration-300 flex items-center gap-2`}
                  aria-label="Profile menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* Profile Menu Dropdown */}
                {isProfileMenuOpen && (
                  <div 
                    className={`absolute right-0 mt-2 w-64 ${currentTheme.card} rounded-lg shadow-lg border ${currentTheme.border} overflow-hidden z-[10000] transform transition-all duration-200 ease-in-out`}
                    style={{ 
                      top: '100%',
                      marginTop: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    {/* Profile Section */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-full flex items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                            <img 
                              src={`https://picsum.photos/seed/${userProfile.profileImage}/100/100`}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {account ? abbreviateAddress(account.address) : 'Connect Wallet'}
                            </p>
                            {account && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {walletBalance} SUI
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link 
                        to="/profile"
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 block"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Profile</span>
                        </div>
                      </Link>
                      
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </div>
                      </button>
                      
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Help & Support</span>
                        </div>
                      </button>
                    </div>
                    
                    <div className="py-2 border-t border-gray-200 dark:border-gray-700">
                      <button className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Disconnect</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet Button */}
              <div className="ml-2 relative z-[100]">
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-[1px] bg-[#333333] opacity-20`}></div>

        {/* Bottom row with menu and search */}
        <div className="py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Desktop Menu */}
            <nav className="hidden lg:flex space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab)}
                  className={`
                    whitespace-nowrap py-2 px-4 text-xl font-['Teko'] tracking-wide rounded-lg transition-all duration-300
                    ${activeTab === tab.name
                      ? `${currentTheme.tabActive} ${currentTheme.text}`
                      : `${currentTheme.tabInactive} hover:shadow-lg ${isDarkMode ? 'hover:shadow-[#00FF85]/20' : 'hover:shadow-[#EB750E]/20'} hover:scale-105`
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>

            {/* Mobile Menu */}
            <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 right-0 mt-2 ${currentTheme.card} shadow-lg rounded-lg border ${currentTheme.border} z-50`}>
              <nav className="p-4">
                <div className="flex flex-col space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => {
                        handleTabClick(tab);
                        setIsMenuOpen(false);
                      }}
                      className={`
                        text-left whitespace-nowrap py-2 px-4 text-xl tracking-wide rounded-lg transition-all duration-300
                        ${activeTab === tab.name
                          ? `${currentTheme.tabActive} ${currentTheme.text}`
                          : `${currentTheme.tabInactive} hover:shadow-lg ${isDarkMode ? 'hover:shadow-[#00FF85]/20' : 'hover:shadow-[#EB750E]/20'} hover:scale-105`
                        }
                      `}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              </nav>
            </div>

            <div className="relative w-[602px]">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-3 pr-8 py-1 text-base font-['Teko'] outline-none border-none bg-transparent shadow-none focus:ring-0 focus:outline-none"
                style={{ boxShadow: 'none', background: 'none', border: 'none' }}
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Side Tray */}
        <div 
          className={`fixed right-0 top-0 h-full ${currentTheme.background} shadow-xl transform transition-all duration-300 ease-in-out z-[9999] ${
            isAnalyticsOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
          }`}
          style={{
            width: `${analyticsWidth}px`,
            maxWidth: '600px',
            minWidth: '200px'
          }}
          onMouseDown={handleDragStart}
        >
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Analytics</h2>
              <button
                onClick={() => setIsAnalyticsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Close analytics"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={`transition-opacity duration-300 ${isAnalyticsOpen ? 'opacity-100' : 'opacity-0'}`}>
              {renderAnalytics(activeTab)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 