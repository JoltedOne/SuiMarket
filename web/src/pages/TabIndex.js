import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';

// Sample data for collections and sections
const collectionsData = {
  featured: [
    { id: 1, name: 'Cosmic Dreams #1', creator: 'Luna Digital', image: 'new1', type: '1/1', price: '50 SUI', category: 'featured' },
    { id: 2, name: 'Digital Oasis', creator: 'Pixel Dreams', image: 'new2', type: 'Edition 1/10', price: '75 SUI', category: 'featured' },
    { id: 3, name: 'Neon Nights', creator: 'Neon Artist', image: 'new3', type: '1/1', price: '45 SUI', category: 'featured' }
  ],
  popular: [
    { id: 4, name: 'Quantum Echoes', creator: 'Quantum Creator', image: 'new4', type: 'Edition 2/10', price: '65 SUI', category: 'popular' },
    { id: 5, name: 'Digital Serenity', creator: 'Zen Digital', image: 'new5', type: '1/1', price: '55 SUI', category: 'popular' },
    { id: 6, name: 'Cyber Dreams', creator: 'Cyber Artist', image: 'new6', type: 'Edition 3/10', price: '85 SUI', category: 'popular' }
  ],
  exclusive: [
    { id: 7, name: 'Genesis Collection', creator: 'Genesis Artist', image: 'excl1', type: '1/1', price: '500 SUI', category: 'exclusive' },
    { id: 8, name: 'Royal Edition', creator: 'Royal Creator', image: 'excl2', type: 'Edition 1/3', price: '450 SUI', category: 'exclusive' },
    { id: 9, name: 'Masterpiece Series', creator: 'Master Artist', image: 'excl3', type: '1/1', price: '600 SUI', category: 'exclusive' }
  ]
};

function TabIndex() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('featured');

  // Map category to tab name
  const categoryToTab = {
    'featured': 'New',
    'popular': 'Popular',
    'exclusive': 'Exclusive'
  };

  // Map tab name to category
  const tabToCategory = {
    'New': 'featured',
    'Popular': 'popular',
    'Exclusive': 'exclusive'
  };

  // Parse URL query parameters and update tab state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    
    if (category && categoryToTab[category]) {
      setSelectedCategory(category);
      setActiveTab(categoryToTab[category]);
    } else {
      // Default to 'New' tab if no category is specified
      setSelectedCategory('featured');
      setActiveTab('New');
      navigate('/collections?category=featured');
    }
  }, [location.search, navigate]);

  // Update URL when tab changes
  useEffect(() => {
    const category = tabToCategory[activeTab];
    if (category) {
      navigate(`/collections?category=${category}`);
    }
  }, [activeTab, navigate]);

  // Update URL when category changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setActiveTab(categoryToTab[category]);
  };

  // Theme styles
  const themeStyles = {
    dark: {
      background: 'bg-[#121212]',
      text: 'text-[#E0E0E0]',
      card: 'bg-[#121212] border border-[#444444]',
      cardHover: 'hover:shadow-xl hover:shadow-[#00FF85]/10',
      border: 'border-[#444444]',
      tabActive: 'bg-[#444444] text-[#E0E0E0] rounded-lg',
      tabInactive: 'text-[#B0B0B0] hover:text-[#E0E0E0] hover:bg-[#444444]/50 rounded-lg',
      description: 'text-[#B0B0B0]',
      price: 'text-[#00FF85]',
      searchInput: 'bg-[#1A1A1A] border-[#444444] text-[#E0E0E0]',
      categoryButton: 'bg-[#1A1A1A] hover:bg-[#444444] text-[#E0E0E0]',
      categoryButtonActive: 'bg-[#00FF85] text-[#121212]'
    },
    light: {
      background: 'bg-[#e5e8f0]',
      text: 'text-[#333333]',
      card: 'bg-[#e5e8f0] border border-[#333333]',
      cardHover: 'hover:shadow-xl hover:shadow-[#EB750E]/20',
      border: 'border-[#333333]',
      tabActive: 'bg-[#444444] text-[#e5e8f0] rounded-lg',
      tabInactive: 'text-[#888888] hover:text-[#333333] hover:bg-[#B3B3B3]/50 rounded-lg',
      description: 'text-[#888888]',
      price: 'text-[#EB750E]',
      searchInput: 'bg-white border-[#333333] text-[#333333]',
      categoryButton: 'bg-white hover:bg-[#EB750E]/10 text-[#333333]',
      categoryButtonActive: 'bg-[#EB750E] text-white'
    }
  };

  const currentTheme = isDarkMode ? themeStyles.dark : themeStyles.light;

  const categories = [
    { id: 'featured', name: 'New' },
    { id: 'popular', name: 'Popular' },
    { id: 'exclusive', name: 'Exclusive' }
  ];

  const handleCollectionClick = (collectionId) => {
    navigate(`/collections/${collectionId}`);
  };

  const filteredCollections = () => {
    let collections = collectionsData[selectedCategory] || [];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      collections = collections.filter(collection => 
        collection.name.toLowerCase().includes(query) ||
        collection.creator.toLowerCase().includes(query)
      );
    }

    return collections;
  };

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        currentTheme={currentTheme}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Helvetica'] mt-[140px]">
        {/* Search and Filter Section */}
        <div className={`${currentTheme.card} rounded-lg p-6 mb-8`}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder={`Search ${activeTab.toLowerCase()} collections...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${currentTheme.searchInput} focus:outline-none focus:ring-2 focus:ring-[#00FF85]`}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    selectedCategory === category.id
                      ? currentTheme.categoryButtonActive
                      : currentTheme.categoryButton
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Collections Grid with Category Title */}
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
            {activeTab} Collections
          </h2>
          <p className={`text-sm ${currentTheme.description} mt-1`}>
            {filteredCollections().length} collections found
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCollections().map((collection) => (
            <div
              key={collection.id}
              onClick={() => handleCollectionClick(collection.id)}
              className={`${currentTheme.card} rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 ${currentTheme.cardHover}`}
            >
              <div className="relative">
                <img
                  src={`https://picsum.photos/seed/${collection.image}/800/600`}
                  alt={collection.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {collection.type}
                </div>
              </div>
              <div className="p-4">
                <h3 className={`text-lg font-bold ${currentTheme.text} mb-2`}>{collection.name}</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img
                      src={`https://picsum.photos/seed/creator${collection.id}/100/100`}
                      alt={collection.creator}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className={`text-sm ${currentTheme.description}`}>{collection.creator}</span>
                  </div>
                  <span className={`text-sm font-semibold ${currentTheme.price}`}>{collection.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCollections().length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${currentTheme.description}`}>No collections found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default TabIndex; 