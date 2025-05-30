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

function Collections({ isDarkMode, toggleTheme, currentTheme }) {
  const { account } = useWallet();
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Listings');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsWidth, setAnalyticsWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [itemData, setItemData] = useState(null);
  const [currentAnalytics, setCurrentAnalytics] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [collectionName, setCollectionName] = useState('Cosmic Dreams');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [collection, setCollection] = useState(null);

  // Sample collection data (in a real app, this would come from an API)
  const collectionsData = {
    1: {
      name: 'Cosmic Dreams #1',
      creator: 'Luna Digital',
      bannerImage: 'collection-banner-1',
      profileImage: 'collection-profile-1',
      items: [
        { id: 'new1', name: 'Cosmic Dreams #1', price: '50 SUI', creator: 'Luna Digital', image: 'new1', type: '1/1', date: '2024-03-15' },
        { id: 'new1-2', name: 'Cosmic Dreams #2', price: '55 SUI', creator: 'Luna Digital', image: 'new1-2', type: '1/1', date: '2024-03-14' },
        { id: 'new1-3', name: 'Cosmic Dreams #3', price: '60 SUI', creator: 'Luna Digital', image: 'new1-3', type: '1/1', date: '2024-03-13' },
        { id: 'new1-4', name: 'Cosmic Dreams #4', price: '65 SUI', creator: 'Luna Digital', image: 'new1-4', type: '1/1', date: '2024-03-12' },
        { id: 'new1-5', name: 'Cosmic Dreams #5', price: '70 SUI', creator: 'Luna Digital', image: 'new1-5', type: '1/1', date: '2024-03-11' },
        { id: 'new1-6', name: 'Cosmic Dreams #6', price: '75 SUI', creator: 'Luna Digital', image: 'new1-6', type: '1/1', date: '2024-03-10' }
      ]
    },
    2: {
      name: 'Digital Oasis',
      creator: 'Pixel Dreams',
      bannerImage: 'collection-banner-2',
      profileImage: 'collection-profile-2',
      items: [
        { id: 'new2', name: 'Digital Oasis #1', price: '75 SUI', creator: 'Pixel Dreams', image: 'new2', type: 'Edition 1/10', date: '2024-03-10' },
        { id: 'new2-2', name: 'Digital Oasis #2', price: '80 SUI', creator: 'Pixel Dreams', image: 'new2-2', type: 'Edition 2/10', date: '2024-03-09' },
        { id: 'new2-3', name: 'Digital Oasis #3', price: '85 SUI', creator: 'Pixel Dreams', image: 'new2-3', type: 'Edition 3/10', date: '2024-03-08' },
        { id: 'new2-4', name: 'Digital Oasis #4', price: '90 SUI', creator: 'Pixel Dreams', image: 'new2-4', type: 'Edition 4/10', date: '2024-03-07' },
        { id: 'new2-5', name: 'Digital Oasis #5', price: '95 SUI', creator: 'Pixel Dreams', image: 'new2-5', type: 'Edition 5/10', date: '2024-03-06' },
        { id: 'new2-6', name: 'Digital Oasis #6', price: '100 SUI', creator: 'Pixel Dreams', image: 'new2-6', type: 'Edition 6/10', date: '2024-03-05' }
      ]
    },
    3: {
      name: 'Neon Nights',
      creator: 'Neon Artist',
      bannerImage: 'collection-banner-3',
      profileImage: 'collection-profile-3',
      items: [
        { id: 'new3', name: 'Neon Nights #1', price: '45 SUI', creator: 'Neon Artist', image: 'new3', type: '1/1', date: '2024-03-05' },
        { id: 'new3-2', name: 'Neon Nights #2', price: '50 SUI', creator: 'Neon Artist', image: 'new3-2', type: '1/1', date: '2024-03-04' },
        { id: 'new3-3', name: 'Neon Nights #3', price: '55 SUI', creator: 'Neon Artist', image: 'new3-3', type: '1/1', date: '2024-03-03' },
        { id: 'new3-4', name: 'Neon Nights #4', price: '60 SUI', creator: 'Neon Artist', image: 'new3-4', type: '1/1', date: '2024-03-02' },
        { id: 'new3-5', name: 'Neon Nights #5', price: '65 SUI', creator: 'Neon Artist', image: 'new3-5', type: '1/1', date: '2024-03-01' },
        { id: 'new3-6', name: 'Neon Nights #6', price: '70 SUI', creator: 'Neon Artist', image: 'new3-6', type: '1/1', date: '2024-02-29' }
      ]
    },
    4: {
      name: 'Quantum Echoes',
      creator: 'Quantum Creator',
      bannerImage: 'collection-banner-4',
      profileImage: 'collection-profile-4',
      items: [
        { id: 'new4', name: 'Quantum Echoes #1', price: '65 SUI', creator: 'Quantum Creator', image: 'new4', type: 'Edition 2/10', date: '2024-03-01' },
        { id: 'new4-2', name: 'Quantum Echoes #2', price: '70 SUI', creator: 'Quantum Creator', image: 'new4-2', type: 'Edition 3/10', date: '2024-02-29' },
        { id: 'new4-3', name: 'Quantum Echoes #3', price: '75 SUI', creator: 'Quantum Creator', image: 'new4-3', type: 'Edition 4/10', date: '2024-02-28' },
        { id: 'new4-4', name: 'Quantum Echoes #4', price: '80 SUI', creator: 'Quantum Creator', image: 'new4-4', type: 'Edition 5/10', date: '2024-02-27' },
        { id: 'new4-5', name: 'Quantum Echoes #5', price: '85 SUI', creator: 'Quantum Creator', image: 'new4-5', type: 'Edition 6/10', date: '2024-02-26' },
        { id: 'new4-6', name: 'Quantum Echoes #6', price: '90 SUI', creator: 'Quantum Creator', image: 'new4-6', type: 'Edition 7/10', date: '2024-02-25' }
      ]
    },
    5: {
      name: 'Digital Serenity',
      creator: 'Zen Digital',
      bannerImage: 'collection-banner-5',
      profileImage: 'collection-profile-5',
      items: [
        { id: 'new5', name: 'Digital Serenity #1', price: '55 SUI', creator: 'Zen Digital', image: 'new5', type: '1/1', date: '2024-02-28' },
        { id: 'new5-2', name: 'Digital Serenity #2', price: '60 SUI', creator: 'Zen Digital', image: 'new5-2', type: '1/1', date: '2024-02-27' },
        { id: 'new5-3', name: 'Digital Serenity #3', price: '65 SUI', creator: 'Zen Digital', image: 'new5-3', type: '1/1', date: '2024-02-26' },
        { id: 'new5-4', name: 'Digital Serenity #4', price: '70 SUI', creator: 'Zen Digital', image: 'new5-4', type: '1/1', date: '2024-02-25' },
        { id: 'new5-5', name: 'Digital Serenity #5', price: '75 SUI', creator: 'Zen Digital', image: 'new5-5', type: '1/1', date: '2024-02-24' },
        { id: 'new5-6', name: 'Digital Serenity #6', price: '80 SUI', creator: 'Zen Digital', image: 'new5-6', type: '1/1', date: '2024-02-23' }
      ]
    },
    6: {
      name: 'Cyber Dreams',
      creator: 'Cyber Artist',
      bannerImage: 'collection-banner-6',
      profileImage: 'collection-profile-6',
      items: [
        { id: 'new6', name: 'Cyber Dreams #1', price: '85 SUI', creator: 'Cyber Artist', image: 'new6', type: 'Edition 3/10', date: '2024-02-25' },
        { id: 'new6-2', name: 'Cyber Dreams #2', price: '90 SUI', creator: 'Cyber Artist', image: 'new6-2', type: 'Edition 4/10', date: '2024-02-24' },
        { id: 'new6-3', name: 'Cyber Dreams #3', price: '95 SUI', creator: 'Cyber Artist', image: 'new6-3', type: 'Edition 5/10', date: '2024-02-23' },
        { id: 'new6-4', name: 'Cyber Dreams #4', price: '100 SUI', creator: 'Cyber Artist', image: 'new6-4', type: 'Edition 6/10', date: '2024-02-22' },
        { id: 'new6-5', name: 'Cyber Dreams #5', price: '105 SUI', creator: 'Cyber Artist', image: 'new6-5', type: 'Edition 7/10', date: '2024-02-21' },
        { id: 'new6-6', name: 'Cyber Dreams #6', price: '110 SUI', creator: 'Cyber Artist', image: 'new6-6', type: 'Edition 8/10', date: '2024-02-20' }
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

  const handleImageClick = (item) => {
    // Generate unique identifiers for the image detail view
    const detailId = `collection-detail-${collectionId}-${item.id}`;
    const imageDetailClass = `collection-image-${collectionId}-${item.id}`;
    const collectionDetailClass = `collection-detail-${collectionId}`;

    // Navigate to image detail with the item's image ID
    navigate(`/image-detail/${collectionId}/${item.image}`, {
      state: {
        detailId,
        imageDetailClass,
        collectionDetailClass,
        itemData: item
      }
    });
  };

  const renderCollectionItem = (item) => {
    const cardStyle = `bg-transparent overflow-hidden font-['Helvetica'] flex flex-col ${currentTheme.cardHover} cursor-pointer transition-transform duration-300 hover:scale-105`;
    const imageContainerStyle = `w-full border-[25px] ${currentTheme.imageBorder} overflow-hidden relative`;
    const imageStyle = "w-full h-[400px] object-cover";
    const infoContainerStyle = "p-6 flex flex-col justify-between";
    const titleStyle = `text-xl font-bold ${currentTheme.text} mb-4 tracking-wide`;
    const priceStyle = `text-xs font-semibold ${currentTheme.price} tracking-wide m-[10px]`;
    const creatorStyle = `flex items-center space-x-3 ${currentTheme.description} text-sm tracking-wide`;
    const profileImageStyle = "w-8 h-8 object-cover border-2 border-[#444444]";
    const typeStyle = `text-sm ${item.type === '1/1' ? 'text-[#00CC6A]' : 'text-[#00994D]'} mb-2`;

    // Generate unique identifiers
    const detailId = `collection-detail-${collectionId}-${item.id}`;
    const imageDetailClass = `collection-image-${collectionId}-${item.id}`;
    const collectionDetailClass = `collection-detail-${collectionId}`;

    return (
      <div 
        key={item.id}
        className={`${cardStyle} collection-item-${item.id} ${collectionDetailClass}`}
        onClick={() => handleImageClick(item)}
        data-collection-id={collectionId}
        data-item-id={item.id}
        data-detail-id={detailId}
      >
        <div 
          className={`${imageContainerStyle} image-container-${item.id} ${imageDetailClass}`}
          data-detail-container={detailId}
        >
          <img 
            src={`https://picsum.photos/seed/${item.image}/800/600`}
            alt={item.name}
            className={`${imageStyle} collection-image-${item.id} ${imageDetailClass}`}
            loading="lazy"
            data-image-id={item.image}
            data-detail-image={detailId}
            data-collection-detail={collectionDetailClass}
          />
          <div 
            className={`absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300 ${imageDetailClass}-overlay`}
            data-detail-overlay={detailId}
          />
        </div>
        <div className={`${infoContainerStyle} info-container-${item.id}`}>
          <div className="flex justify-between items-start">
            <div className="flex-grow pr-2">
              <h3 className={`${titleStyle} collection-title-${item.id}`}>{item.name}</h3>
              <div className={`${typeStyle} collection-type-${item.id}`}>
                {item.type}
              </div>
              <div className={`${creatorStyle} creator-info-${item.id}`}>
                <img 
                  src={`https://picsum.photos/seed/profile${item.id}/100/100`}
                  alt={item.creator}
                  className={`${profileImageStyle} creator-image-${item.id}`}
                  loading="lazy"
                  data-creator-id={item.id}
                />
                <span className={`truncate creator-name-${item.id}`}>{item.creator}</span>
              </div>
            </div>
            <div className={`${priceStyle} price-tag-${item.id}`}>
              {item.price}
            </div>
          </div>
        </div>
      </div>
    );
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
          {collection.items.map(item => renderCollectionItem(item))}
        </div>
      </main>
    </div>
  );
}

export default Collections; 