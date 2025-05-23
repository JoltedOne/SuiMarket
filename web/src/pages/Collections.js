import React, { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import In_Image from '../components/In_Image';
import { JsonRpcProvider, Connection } from '@mysten/sui.js';

// Add font imports
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap');
`;

function Collections() {
  const { account } = useWallet();
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('New');
  const [isEditingName, setIsEditingName] = useState(false);
  const [collectionName, setCollectionName] = useState('Cosmic Dreams');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [collection, setCollection] = useState(null);

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
      },
      settingsDropdown: 'bg-[#121212] border-[#444444]',
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
      },
      settingsDropdown: 'bg-[#e5e8f0] border-[#333333]',
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Sample collection data (in a real app, this would come from an API)
  const collectionsData = {
    1: {
      name: 'Cosmic Dreams #1',
      creator: 'Luna Digital',
      bannerImage: 'collection-banner-1',
      profileImage: 'collection-profile-1',
      items: [
        { id: 1, name: 'Cosmic Dreams #1', price: '50 SUI', creator: 'Luna Digital', image: 'new1', type: '1/1', date: '2024-03-15' },
        { id: 2, name: 'Cosmic Dreams #2', price: '55 SUI', creator: 'Luna Digital', image: 'new1-2', type: '1/1', date: '2024-03-14' },
        { id: 3, name: 'Cosmic Dreams #3', price: '60 SUI', creator: 'Luna Digital', image: 'new1-3', type: '1/1', date: '2024-03-13' },
        { id: 4, name: 'Cosmic Dreams #4', price: '65 SUI', creator: 'Luna Digital', image: 'new1-4', type: '1/1', date: '2024-03-12' },
        { id: 5, name: 'Cosmic Dreams #5', price: '70 SUI', creator: 'Luna Digital', image: 'new1-5', type: '1/1', date: '2024-03-11' },
        { id: 6, name: 'Cosmic Dreams #6', price: '75 SUI', creator: 'Luna Digital', image: 'new1-6', type: '1/1', date: '2024-03-10' }
      ]
    },
    2: {
      name: 'Digital Oasis',
      creator: 'Pixel Dreams',
      bannerImage: 'collection-banner-2',
      profileImage: 'collection-profile-2',
      items: [
        { id: 1, name: 'Digital Oasis #1', price: '75 SUI', creator: 'Pixel Dreams', image: 'new2', type: 'Edition 1/10', date: '2024-03-10' },
        { id: 2, name: 'Digital Oasis #2', price: '80 SUI', creator: 'Pixel Dreams', image: 'new2-2', type: 'Edition 2/10', date: '2024-03-09' },
        { id: 3, name: 'Digital Oasis #3', price: '85 SUI', creator: 'Pixel Dreams', image: 'new2-3', type: 'Edition 3/10', date: '2024-03-08' },
        { id: 4, name: 'Digital Oasis #4', price: '90 SUI', creator: 'Pixel Dreams', image: 'new2-4', type: 'Edition 4/10', date: '2024-03-07' },
        { id: 5, name: 'Digital Oasis #5', price: '95 SUI', creator: 'Pixel Dreams', image: 'new2-5', type: 'Edition 5/10', date: '2024-03-06' },
        { id: 6, name: 'Digital Oasis #6', price: '100 SUI', creator: 'Pixel Dreams', image: 'new2-6', type: 'Edition 6/10', date: '2024-03-05' }
      ]
    },
    3: {
      name: 'Neon Nights',
      creator: 'Neon Artist',
      bannerImage: 'collection-banner-3',
      profileImage: 'collection-profile-3',
      items: [
        { id: 1, name: 'Neon Nights #1', price: '45 SUI', creator: 'Neon Artist', image: 'new3', type: '1/1', date: '2024-03-05' },
        { id: 2, name: 'Neon Nights #2', price: '50 SUI', creator: 'Neon Artist', image: 'new3-2', type: '1/1', date: '2024-03-04' },
        { id: 3, name: 'Neon Nights #3', price: '55 SUI', creator: 'Neon Artist', image: 'new3-3', type: '1/1', date: '2024-03-03' },
        { id: 4, name: 'Neon Nights #4', price: '60 SUI', creator: 'Neon Artist', image: 'new3-4', type: '1/1', date: '2024-03-02' },
        { id: 5, name: 'Neon Nights #5', price: '65 SUI', creator: 'Neon Artist', image: 'new3-5', type: '1/1', date: '2024-03-01' },
        { id: 6, name: 'Neon Nights #6', price: '70 SUI', creator: 'Neon Artist', image: 'new3-6', type: '1/1', date: '2024-02-29' }
      ]
    },
    4: {
      name: 'Quantum Echoes',
      creator: 'Quantum Creator',
      bannerImage: 'collection-banner-4',
      profileImage: 'collection-profile-4',
      items: [
        { id: 1, name: 'Quantum Echoes #1', price: '65 SUI', creator: 'Quantum Creator', image: 'new4', type: 'Edition 2/10', date: '2024-03-01' },
        { id: 2, name: 'Quantum Echoes #2', price: '70 SUI', creator: 'Quantum Creator', image: 'new4-2', type: 'Edition 3/10', date: '2024-02-29' },
        { id: 3, name: 'Quantum Echoes #3', price: '75 SUI', creator: 'Quantum Creator', image: 'new4-3', type: 'Edition 4/10', date: '2024-02-28' },
        { id: 4, name: 'Quantum Echoes #4', price: '80 SUI', creator: 'Quantum Creator', image: 'new4-4', type: 'Edition 5/10', date: '2024-02-27' },
        { id: 5, name: 'Quantum Echoes #5', price: '85 SUI', creator: 'Quantum Creator', image: 'new4-5', type: 'Edition 6/10', date: '2024-02-26' },
        { id: 6, name: 'Quantum Echoes #6', price: '90 SUI', creator: 'Quantum Creator', image: 'new4-6', type: 'Edition 7/10', date: '2024-02-25' }
      ]
    },
    5: {
      name: 'Digital Serenity',
      creator: 'Zen Digital',
      bannerImage: 'collection-banner-5',
      profileImage: 'collection-profile-5',
      items: [
        { id: 1, name: 'Digital Serenity #1', price: '55 SUI', creator: 'Zen Digital', image: 'new5', type: '1/1', date: '2024-02-28' },
        { id: 2, name: 'Digital Serenity #2', price: '60 SUI', creator: 'Zen Digital', image: 'new5-2', type: '1/1', date: '2024-02-27' },
        { id: 3, name: 'Digital Serenity #3', price: '65 SUI', creator: 'Zen Digital', image: 'new5-3', type: '1/1', date: '2024-02-26' },
        { id: 4, name: 'Digital Serenity #4', price: '70 SUI', creator: 'Zen Digital', image: 'new5-4', type: '1/1', date: '2024-02-25' },
        { id: 5, name: 'Digital Serenity #5', price: '75 SUI', creator: 'Zen Digital', image: 'new5-5', type: '1/1', date: '2024-02-24' },
        { id: 6, name: 'Digital Serenity #6', price: '80 SUI', creator: 'Zen Digital', image: 'new5-6', type: '1/1', date: '2024-02-23' }
      ]
    },
    6: {
      name: 'Cyber Dreams',
      creator: 'Cyber Artist',
      bannerImage: 'collection-banner-6',
      profileImage: 'collection-profile-6',
      items: [
        { id: 1, name: 'Cyber Dreams #1', price: '85 SUI', creator: 'Cyber Artist', image: 'new6', type: 'Edition 3/10', date: '2024-02-25' },
        { id: 2, name: 'Cyber Dreams #2', price: '90 SUI', creator: 'Cyber Artist', image: 'new6-2', type: 'Edition 4/10', date: '2024-02-24' },
        { id: 3, name: 'Cyber Dreams #3', price: '95 SUI', creator: 'Cyber Artist', image: 'new6-3', type: 'Edition 5/10', date: '2024-02-23' },
        { id: 4, name: 'Cyber Dreams #4', price: '100 SUI', creator: 'Cyber Artist', image: 'new6-4', type: 'Edition 6/10', date: '2024-02-22' },
        { id: 5, name: 'Cyber Dreams #5', price: '105 SUI', creator: 'Cyber Artist', image: 'new6-5', type: 'Edition 7/10', date: '2024-02-21' },
        { id: 6, name: 'Cyber Dreams #6', price: '110 SUI', creator: 'Cyber Artist', image: 'new6-6', type: 'Edition 8/10', date: '2024-02-20' }
      ]
    }
  };

  useEffect(() => {
    // In a real app, this would be an API call
    const foundCollection = collectionsData[collectionId];
    if (foundCollection) {
      setCollection(foundCollection);
      setCollectionName(foundCollection.name);
    } else {
      // If collection not found, redirect to profile
      navigate('/profile');
    }
  }, [collectionId, navigate]);

  const handleNameUpdate = () => {
    setIsEditingName(false);
    // In a real app, this would update the collection name in the backend
  };

  const handleImageClick = (imageId) => {
    navigate(`/collections/${collectionId}/item/${imageId}`);
  };

  if (!collection) {
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
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Helvetica'] mt-[140px] relative z-0">
        {/* Collection Banner */}
        <div className={`relative rounded-lg overflow-hidden mb-8 ${currentTheme.card} z-0`}>
          <img 
            src={`https://picsum.photos/seed/${collection.bannerImage}/1200/300`}
            alt="Collection Banner"
            className="w-full h-[200px] object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-0">
            <div className="flex items-end justify-between relative z-0">
              <div className="flex items-end space-x-4 z-0">
                <img 
                  src={`https://picsum.photos/seed/${collection.profileImage}/200/200`}
                  alt="Collection Profile"
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800"
                />
                <div className="z-0">
                  {isEditingName ? (
                    <div className="flex items-center space-x-2 z-0">
                      <input
                        type="text"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        className={`text-2xl font-bold bg-transparent border-b ${currentTheme.border} focus:outline-none focus:border-[#00FF85] z-0`}
                      />
                      <button
                        onClick={handleNameUpdate}
                        className={`px-3 py-1 rounded-lg ${currentTheme.button} z-0`}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setCollectionName(collection.name);
                        }}
                        className={`px-3 py-1 rounded-lg ${currentTheme.card} ${currentTheme.text} hover:bg-opacity-80 pr-5 z-0`}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 z-0">
                      <h1 className="text-2xl font-bold">{collectionName}</h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className={`p-1 rounded-lg ${currentTheme.card} hover:bg-opacity-80 z-0`}
                        aria-label="Edit collection name"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <p className="text-sm opacity-80">Created by {collection.creator}</p>
                </div>
              </div>
              <div className="relative z-[999999]">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`p-2 rounded-lg ${currentTheme.card} hover:bg-opacity-80 relative z-[999999]`}
                  aria-label="Collection settings"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                {isSettingsOpen && (
                  <>
                    <div className="fixed inset-0 z-[999999]" onClick={() => setIsSettingsOpen(false)} />
                    <div 
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${currentTheme.settingsDropdown} border ${currentTheme.border} z-[999999]`} 
                      onClick={e => e.stopPropagation()}
                      style={{ position: 'fixed', top: 'auto', right: '2rem' }}
                    >
                      <div className="py-1">
                        <button className={`w-full px-4 py-2 text-left text-sm ${currentTheme.text} hover:bg-gray-100 dark:hover:bg-gray-700`}>
                          Edit Collection
                        </button>
                        <button className={`w-full px-4 py-2 text-left text-sm ${currentTheme.text} hover:bg-gray-100 dark:hover:bg-gray-700`}>
                          Share Collection
                        </button>
                        <button className={`w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700`}>
                          Delete Collection
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-0">
          {collection.items.map((item) => (
            <In_Image
              key={item.id}
              imageId={item.image}
              title={item.name}
              price={item.price}
              creator={item.creator}
              creatorImageId={item.id}
              type={item.type}
              currentTheme={currentTheme}
              collectionId={collectionId}
              onImageClick={handleImageClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Collections; 