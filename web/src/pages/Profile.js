import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConnectButton } from '@suiet/wallet-kit';
import { JsonRpcProvider, Connection } from '@mysten/sui.js';
import Header from '../components/Header';
import { useWalletKit } from '@mysten/wallet-kit';

// Add font imports
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap');
`;

function Profile({ isDarkMode, toggleTheme, currentTheme }) {
  const [activeTab, setActiveTab] = useState('Listings');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsWidth, setAnalyticsWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [itemData, setItemData] = useState(null);
  const [currentAnalytics, setCurrentAnalytics] = useState(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Recently Collected');
  const [userProfile, setUserProfile] = useState({
    name: 'CryptoArtist',
    rank: 'Gold Collector',
    profileImage: 'profile1',
    bannerImage: 'banner1',
    bio: 'Digital artist and NFT collector passionate about the future of digital art.',
    walletAddress: '',
    social: {
      twitter: 'https://twitter.com/cryptoartist',
      instagram: 'https://instagram.com/cryptoartist',
      website: 'https://cryptoartist.com'
    },
    achievements: [
      { name: 'Gold Collector', icon: '🏆' },
      { name: 'Early Adopter', icon: '🚀' },
      { name: 'Top Trader', icon: '💎' }
    ],
    collections: [
      { id: 1, name: 'Cosmic Dreams #1', price: '50 SUI', creator: 'Luna Digital', image: 'new1', type: '1/1', date: '2024-03-15' },
      { id: 2, name: 'Digital Oasis', price: '75 SUI', creator: 'Pixel Dreams', image: 'new2', type: 'Edition 1/10', date: '2024-03-10' },
      { id: 3, name: 'Neon Nights', price: '45 SUI', creator: 'Neon Artist', image: 'new3', type: '1/1', date: '2024-03-05' },
      { id: 4, name: 'Quantum Echoes', price: '65 SUI', creator: 'Quantum Creator', image: 'new4', type: 'Edition 2/10', date: '2024-03-01' },
      { id: 5, name: 'Digital Serenity', price: '55 SUI', creator: 'Zen Digital', image: 'new5', type: '1/1', date: '2024-02-28' },
      { id: 6, name: 'Cyber Dreams', price: '85 SUI', creator: 'Cyber Artist', image: 'new6', type: 'Edition 3/10', date: '2024-02-25' }
    ]
  });
  const [walletBalance, setWalletBalance] = useState('0.00');
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [isEditingInstagram, setIsEditingInstagram] = useState(false);
  const [isEditingTwitter, setIsEditingTwitter] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const navigate = useNavigate();
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const { currentAccount } = useWalletKit();
  const [bio, setBio] = useState('');

  // Function to abbreviate wallet address
  const abbreviateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to copy address to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here if you want
  };

  const sortOptions = ['Recently Collected', 'Oldest', 'Newest'];

  const sortCollections = (collections) => {
    switch(sortBy) {
      case 'Recently Collected':
        return [...collections].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'Oldest':
        return [...collections].sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'Newest':
        return [...collections].sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return collections;
    }
  };

  // Update wallet balance when account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (currentAccount?.address) {
        try {
          const connection = new Connection({
            fullnode: 'https://fullnode.mainnet.sui.io',
          });
          const provider = new JsonRpcProvider(connection);
          
          const balance = await provider.getBalance({
            owner: currentAccount.address,
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
  }, [currentAccount]);

  // Add these functions to handle social media URL updates
  const handleWebsiteUpdate = () => {
    setUserProfile(prev => ({
      ...prev,
      social: {
        ...prev.social,
        website: websiteUrl
      }
    }));
    setIsEditingWebsite(false);
  };

  const handleInstagramUpdate = () => {
    setUserProfile(prev => ({
      ...prev,
      social: {
        ...prev.social,
        instagram: instagramUrl
      }
    }));
    setIsEditingInstagram(false);
  };

  const handleTwitterUpdate = () => {
    setUserProfile(prev => ({
      ...prev,
      social: {
        ...prev.social,
        twitter: twitterUrl
      }
    }));
    setIsEditingTwitter(false);
  };

  // Update URLs when userProfile changes
  useEffect(() => {
    setWebsiteUrl(userProfile.social.website);
    setInstagramUrl(userProfile.social.instagram);
    setTwitterUrl(userProfile.social.twitter);
  }, [userProfile.social]);

  // Helper function to get display text from URL
  const getDisplayText = (url) => {
    try {
      const urlObj = new URL(url);
      // Special handling for Instagram URLs
      if (urlObj.hostname.includes('instagram.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return pathParts[0] || 'instagram.com';
      }
      // Special handling for Twitter URLs
      if (urlObj.hostname.includes('twitter.com') || urlObj.hostname.includes('x.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return pathParts[0] || 'twitter.com';
      }
      // Default handling for other URLs
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const handleCollectionClick = (collectionId) => {
    // Navigate to the collection detail page
    navigate(`/collections/${collectionId}`, { replace: true });
  };

  // Update collections data to match the main page format
  const collectionsData = {
    1: {
      name: 'Cosmic Dreams #1',
      creator: 'Luna Digital',
      price: '50 SUI',
      image: 'new1',
      type: '1/1',
      date: '2024-03-15',
      category: 'featured'
    },
    2: {
      name: 'Digital Oasis',
      creator: 'Pixel Dreams',
      price: '75 SUI',
      image: 'new2',
      type: 'Edition 1/10',
      date: '2024-03-10',
      category: 'popular'
    },
    3: {
      name: 'Neon Nights',
      creator: 'Neon Artist',
      price: '45 SUI',
      image: 'new3',
      type: '1/1',
      date: '2024-03-05',
      category: 'exclusive'
    },
    4: {
      name: 'Quantum Echoes',
      creator: 'Quantum Creator',
      price: '65 SUI',
      image: 'new4',
      type: 'Edition 2/10',
      date: '2024-03-01',
      category: 'featured'
    },
    5: {
      name: 'Digital Serenity',
      creator: 'Zen Digital',
      price: '55 SUI',
      image: 'new5',
      type: '1/1',
      date: '2024-02-28',
      category: 'popular'
    },
    6: {
      name: 'Cyber Dreams',
      creator: 'Cyber Artist',
      price: '85 SUI',
      image: 'new6',
      type: 'Edition 3/10',
      date: '2024-02-25',
      category: 'exclusive'
    }
  };

  // Update userProfile collections to use the collectionsData
  useEffect(() => {
    setUserProfile(prev => ({
      ...prev,
      collections: Object.entries(collectionsData).map(([id, data]) => ({
        id: parseInt(id),
        ...data
      }))
    }));
  }, []);

  // Add this function to handle tab clicks
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    // Map tab names to their corresponding main page sections
    const tabToPath = {
      'New': '/tabindex?category=featured',
      'Just Sold': '/tabindex?category=just-sold',
      'Popular': '/tabindex?category=popular',
      'Exclusive': '/tabindex?category=exclusive'
    };
    
    if (tabToPath[tabName]) {
      navigate(tabToPath[tabName]);
    }
  };

  // Determine if this is the user's own profile
  const isOwnProfile = currentAccount && userProfile.walletAddress && currentAccount.address === userProfile.walletAddress;
  console.log('Render check: currentAccount', currentAccount, 'userProfile.walletAddress', userProfile.walletAddress, 'isOwnProfile', isOwnProfile); // Log values on render

  // Fetch profile data from backend
  useEffect(() => {
    console.log('Profile useEffect triggered. currentAccount:', currentAccount);
    const fetchProfile = async () => {
      if (currentAccount?.address) {
        console.log('Fetching profile for address:', currentAccount.address);
        try {
          const response = await fetch(`http://localhost:5001/api/profiles/${currentAccount.address}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Profile data fetched:', data);
          setUserProfile(data);
          setWebsiteUrl(data.social?.website || '');
          setInstagramUrl(data.social?.instagram || '');
          setTwitterUrl(data.social?.twitter || '');
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, [currentAccount]);

  // Update bio when userProfile changes
  useEffect(() => {
    if (userProfile.bio) {
      setBio(userProfile.bio);
    }
  }, [userProfile.bio]);

  // Function to handle profile update
  const handleUpdateProfile = async () => {
    if (!currentAccount?.address) {
      console.error("No wallet connected. Cannot save profile.");
      return;
    }

    const updatedData = {
      name: userProfile.name,
      bio: bio,
      bannerImage: userProfile.bannerImage,
      profileImage: userProfile.profileImage,
      social: {
        twitter: userProfile.social.twitter,
        instagram: userProfile.social.instagram,
        website: userProfile.social.website,
      }
    };

    console.log("Attempting to save profile with data:", updatedData);

    try {
      const response = await fetch(`http://localhost:5001/api/profiles/${currentAccount.address}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}`, errorText);
        // You might want to display an error message to the user here
        throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Profile updated successfully:', result);
      setUserProfile(result); // Update state with the saved profile data from the backend
      setIsEditProfileOpen(false); // Close the modal on successful save
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle update error, e.g., show a user-friendly error message
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      <Header 
        activeTab={activeTab}
        setActiveTab={handleTabClick}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        currentTheme={currentTheme}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Helvetica'] mt-[140px]">
        {/* Profile Banner */}
        <div className={`relative rounded-lg overflow-hidden mb-8 ${currentTheme.card} ${currentTheme.walletBanner}`}>
          <img 
            src={`https://picsum.photos/seed/${userProfile.bannerImage}/1200/300?t=${Date.now()}`}
            alt="Profile Banner"
            className="w-full h-[200px] object-cover cursor-pointer"
            onClick={isOwnProfile ? () => setIsBannerModalOpen(true) : undefined}
            style={{ transition: 'box-shadow 0.2s' }}
          />
          {/* Modal for enlarged banner */}
          {isBannerModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
              <div className="relative">
                <img src={`https://picsum.photos/seed/${userProfile.bannerImage}/1200/600?t=${Date.now()}`} alt="Banner Large" className="rounded-lg max-h-[80vh] max-w-[90vw]" />
                <button onClick={() => setIsBannerModalOpen(false)} className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 text-white hover:bg-opacity-80">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-end space-x-4">
              <div className="relative group">
                <img 
                  src={`https://picsum.photos/seed/${userProfile.profileImage}/200/200?t=${Date.now()}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover cursor-pointer"
                  onClick={isOwnProfile ? () => setIsEditProfileOpen(true) : undefined}
                />
                {/* Pencil hover only for own profile */}
                {isOwnProfile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-200 rounded-full cursor-pointer opacity-0 group-hover:opacity-100"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg break-words max-w-full overflow-hidden text-ellipsis">
                  {userProfile.name}
                </h2>
                <p className="text-sm text-white/90 drop-shadow-lg break-words max-w-full overflow-hidden text-ellipsis">
                  {userProfile.rank}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-white/90 drop-shadow-lg break-words max-w-full overflow-hidden text-ellipsis">
                    {abbreviateAddress(userProfile.walletAddress)}
                  </p>
                  <button
                    onClick={() => copyToClipboard(userProfile.walletAddress)}
                    className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                    title="Copy full address"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Bio */}
            <div className={`p-6 rounded-lg ${currentTheme.card}`}>
              <h2 className="text-lg font-semibold mb-4">About</h2>
              <p className="text-sm opacity-80">{userProfile.bio}</p>
            </div>

            {/* Social Links */}
            <div className={`p-6 rounded-lg ${currentTheme.card}`}>
              <h2 className="text-lg font-semibold mb-4">Social Links</h2>
              <div className="space-y-3">
                {/* Twitter */}
                <div className="flex items-center justify-between">
                  {isEditingTwitter ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="url"
                        value={twitterUrl}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                        placeholder="Enter Twitter/X URL"
                        className={`flex-1 px-3 py-2 rounded-lg ${currentTheme.card} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-[#00FF85]`}
                      />
                      <button
                        onClick={handleTwitterUpdate}
                        className={`px-3 py-2 rounded-lg ${currentTheme.button}`}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingTwitter(false);
                          setTwitterUrl(userProfile.social.twitter);
                        }}
                        className={`px-3 py-2 rounded-lg ${currentTheme.card} ${currentTheme.text} hover:bg-opacity-80 pr-5`}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <a href={userProfile.social.twitter} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-2 ${currentTheme.socialIcon} p-2`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        <span>{getDisplayText(userProfile.social.twitter)}</span>
                      </a>
                      <button
                        onClick={() => setIsEditingTwitter(true)}
                        className={`p-1 rounded-lg ${currentTheme.card} hover:bg-opacity-80`}
                        aria-label="Edit Twitter"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Instagram */}
                <div className="flex items-center justify-between">
                  {isEditingInstagram ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="url"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        placeholder="Enter Instagram URL"
                        className={`flex-1 px-3 py-2 rounded-lg ${currentTheme.card} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-[#00FF85]`}
                      />
                      <button
                        onClick={handleInstagramUpdate}
                        className={`px-3 py-2 rounded-lg ${currentTheme.button}`}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingInstagram(false);
                          setInstagramUrl(userProfile.social.instagram);
                        }}
                        className={`px-3 py-2 rounded-lg ${currentTheme.card} ${currentTheme.text} hover:bg-opacity-80 pr-5`}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <a href={userProfile.social.instagram} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-2 ${currentTheme.socialIcon} p-2`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                        </svg>
                        <span>{getDisplayText(userProfile.social.instagram)}</span>
                      </a>
                      <button
                        onClick={() => setIsEditingInstagram(true)}
                        className={`p-1 rounded-lg ${currentTheme.card} hover:bg-opacity-80`}
                        aria-label="Edit Instagram"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Website */}
                <div className="flex items-center justify-between">
                  {isEditingWebsite ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="Enter website URL"
                        className={`flex-1 px-3 py-2 rounded-lg ${currentTheme.card} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-[#00FF85]`}
                      />
                      <button
                        onClick={handleWebsiteUpdate}
                        className={`px-3 py-2 rounded-lg ${currentTheme.button}`}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingWebsite(false);
                          setWebsiteUrl(userProfile.social.website);
                        }}
                        className={`px-3 py-2 rounded-lg ${currentTheme.card} ${currentTheme.text} hover:bg-opacity-80 pr-5`}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <a href={userProfile.social.website} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-2 ${currentTheme.socialIcon} p-2`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 2c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6zm0 2c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z"/>
                        </svg>
                        <span>{getDisplayText(userProfile.social.website)}</span>
                      </a>
                      <button
                        onClick={() => setIsEditingWebsite(true)}
                        className={`p-1 rounded-lg ${currentTheme.card} hover:bg-opacity-80`}
                        aria-label="Edit Website"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className={`p-6 rounded-lg ${currentTheme.card}`}>
              <h2 className="text-lg font-semibold mb-4">Achievements</h2>
              <div className="space-y-3">
                {userProfile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <span className="text-sm">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Collections */}
          <div className="lg:col-span-2">
            <div className={`p-6 rounded-lg ${currentTheme.card} relative z-0`}>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-semibold">My Collections</h2>
                <div className="flex items-center relative">
                  {/* The square filter button (always visible) */}
                  <button
                    onClick={() => setSortMenuOpen(!sortMenuOpen)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentTheme.card} hover:bg-opacity-80 transition-colors duration-300 z-20 shrink-0`}
                    aria-label="Toggle sort options"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  </button>

                  {/* The sliding bar with current sort and dropdown arrow */}
                  <div className={`flex items-center h-10 overflow-hidden transition-all duration-300 ease-in-out ${sortMenuOpen ? 'max-w-xs opacity-100 ml-2' : 'max-w-0 opacity-0 pointer-events-none'} rounded-r-lg ${currentTheme.card} border-t border-b border-r ${currentTheme.border} z-10`}>
                    <div className="flex items-center h-full transition-opacity duration-150 delay-150">
                      <span className="text-sm mr-2 px-1 py-2 whitespace-nowrap">Sort by: {sortBy}</span>
                      {/* Dropdown toggle button */}
                      <button
                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                        className={`p-1 rounded-lg ${currentTheme.card} hover:bg-opacity-80 transition-colors duration-200 mr-1`}
                        aria-label="Toggle sort options"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform duration-300 ${isSortDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* The dropdown menu */}
                  {isSortDropdownOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg ${currentTheme.profileDropdown} border ${currentTheme.border} overflow-hidden z-50`}>
                      {sortOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setIsSortDropdownOpen(false);
                            setSortMenuOpen(false); // Close bar when option is selected
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-opacity-80 ${currentTheme.text} ${sortBy === option ? 'bg-opacity-20 bg-[#00FF85]' : ''}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortCollections(userProfile.collections).map((collection) => (
                  <div 
                    key={collection.id} 
                    className={`rounded-lg overflow-hidden ${currentTheme.card} ${currentTheme.cardHover} cursor-pointer transition-all duration-300 hover:scale-105`}
                    onClick={() => handleCollectionClick(collection.id)}
                  >
                    <div className="relative">
                      <img 
                        src={`https://picsum.photos/seed/${collection.image}/400/300`}
                        alt={collection.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-semibold ${
                        collection.type === '1/1' ? 'bg-[#00CC6A]/20 text-[#00CC6A]' : 'bg-[#00994D]/20 text-[#00994D]'
                      }`}>
                        {collection.type}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 text-lg">{collection.name}</h3>
                      <div className="flex justify-between items-center">
                        <div className="text-sm opacity-80">
                          <div>Creator: {collection.creator}</div>
                          <div className="text-xs mt-1">Added: {new Date(collection.date).toLocaleDateString()}</div>
                        </div>
                        <div className={`text-lg font-semibold ${currentTheme.price}`}>
                          {collection.price}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className={`bg-[#181818] rounded-lg p-8 w-full max-w-md relative`}>
              <button onClick={() => setIsEditProfileOpen(false)} className="absolute top-2 right-2 bg-black bg-opacity-40 rounded-full p-2 text-white hover:bg-opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-xl font-bold mb-4 text-white">Edit Profile</h2>
              <div className="space-y-4">
                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={`https://picsum.photos/seed/${userProfile.profileImage}/100/100?t=${Date.now()}`} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-700" 
                    />
                    <button 
                      onClick={() => setUserProfile(prev => ({ ...prev, profileImage: Math.floor(Math.random() * 100) }))} 
                      className="px-3 py-1 rounded-lg bg-[#222] text-white hover:bg-[#333] transition-colors duration-200"
                    >
                      Change Picture
                    </button>
                  </div>
                </div>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Name</label>
                  <input 
                    type="text" 
                    value={userProfile.name} 
                    onChange={e => setUserProfile(prev => ({ ...prev, name: e.target.value }))} 
                    className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#222] text-white focus:outline-none focus:border-[#00FF85]" 
                  />
                </div>
                {/* Banner Image */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Banner Image</label>
                  <div className="space-y-2">
                    <img 
                      src={`https://picsum.photos/seed/${userProfile.bannerImage}/200/60?t=${Date.now()}`} 
                      alt="Banner" 
                      className="w-full h-12 object-cover rounded border border-gray-700" 
                    />
                    <button 
                      onClick={() => setUserProfile(prev => ({ ...prev, bannerImage: Math.floor(Math.random() * 100) }))} 
                      className="px-3 py-1 rounded-lg bg-[#222] text-white hover:bg-[#333] transition-colors duration-200"
                    >
                      Change Banner
                    </button>
                  </div>
                </div>
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Bio</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#222] text-white focus:outline-none focus:border-[#00FF85]"
                  ></textarea>
                </div>
                {/* Social Media Links */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Social Media Links</label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={userProfile.social.twitter} 
                      onChange={e => setUserProfile(prev => ({ ...prev, social: { ...prev.social, twitter: e.target.value } }))} 
                      placeholder="X (Twitter)" 
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#222] text-white focus:outline-none focus:border-[#00FF85]" 
                    />
                    <input 
                      type="text" 
                      value={userProfile.social.instagram} 
                      onChange={e => setUserProfile(prev => ({ ...prev, social: { ...prev.social, instagram: e.target.value } }))} 
                      placeholder="Instagram" 
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#222] text-white focus:outline-none focus:border-[#00FF85]" 
                    />
                    <input 
                      type="text" 
                      value={userProfile.social.website} 
                      onChange={e => setUserProfile(prev => ({ ...prev, social: { ...prev.social, website: e.target.value } }))} 
                      placeholder="Personal Website" 
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#222] text-white focus:outline-none focus:border-[#00FF85]" 
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={handleUpdateProfile}
                className="mt-6 w-full py-2 rounded-lg bg-[#00FF85] text-black font-semibold hover:bg-[#00FF85]/90 transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile; 