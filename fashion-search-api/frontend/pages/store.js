import { useState, useEffect } from 'react';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [domain, setDomain] = useState('clothing');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: '',
    sortBy: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);

  const productsPerPage = 12;

  // Create session on component mount
  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setSessionId(data.session_id);
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    };
    createSession();
  }, []);

  // Search products
  const searchProducts = async (query = searchQuery, page = 1) => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({ 
          query: query || 'all products',
          domain,
          page,
          limit: productsPerPage,
          filters
        }),
      });
      const data = await response.json();
      setProducts(data || []);
      setTotalPages(Math.ceil((data?.length || 0) / productsPerPage));
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
    }
    setLoading(false);
  };

  // Load initial products
  useEffect(() => {
    if (sessionId) {
      searchProducts('', 1);
    }
  }, [sessionId, domain]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    searchProducts(searchQuery, 1);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    searchProducts(searchQuery, 1);
  };

  // Pagination
  const goToPage = (page) => {
    setCurrentPage(page);
    searchProducts(searchQuery, page);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1rem 0',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            margin: 0,
            textAlign: 'center'
          }}>
            🛍️ Search-as-Code E-commerce Demo
          </h1>
          <p style={{ 
            textAlign: 'center', 
            color: '#6c757d', 
            margin: '0.5rem 0 0 0',
            fontSize: '1.1rem'
          }}>
            Powered by AI-Enhanced Search & Multi-Domain Ranking
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Search and Filters */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* Domain Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              Search Domain:
            </label>
            <select 
              value={domain} 
              onChange={(e) => setDomain(e.target.value)}
              style={{ 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '1rem',
                width: '200px'
              }}
            >
              <option value="clothing">👕 Clothing & Fashion</option>
              <option value="groceries">🍎 Groceries & Food</option>
              <option value="furniture">🪑 Furniture & Home</option>
              <option value="electronics">📱 Electronics & Tech</option>
            </select>
            <span style={{ 
              marginLeft: '1rem', 
              color: sessionId ? '#28a745' : '#ffc107',
              fontWeight: '500'
            }}>
              {sessionId ? '✅ Connected' : '⏳ Connecting...'}
            </span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Searching...' : '🔍 Search'}
            </button>
          </form>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: showFilters ? '1rem' : 0
            }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'} ⚙️
          </button>

          {/* Filters Panel */}
          {showFilters && (
            <div style={{ 
              border: '1px solid #e9ecef', 
              borderRadius: '4px', 
              padding: '1rem',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Min Price:</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Max Price:</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Sort By:</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
              <button
                onClick={applyFilters}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>
            {loading ? 'Searching...' : `${products.length} Products Found`}
          </h2>
          <div style={{ color: '#6c757d' }}>
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>Searching products...</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {products.map((product, index) => (
              <div key={product.id || index} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={product.image_url}
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/280x200?text=No+Image';
                    }}
                  />
                  {product.score && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: 'rgba(0,123,255,0.9)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {(product.score * 100).toFixed(0)}% match
                    </div>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    lineHeight: '1.3'
                  }}>
                    {product.title}
                  </h3>
                  <p style={{ 
                    color: '#6c757d', 
                    fontSize: '0.9rem',
                    margin: '0 0 0.75rem 0',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: 'auto'
                  }}>
                    <span style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      color: '#28a745' 
                    }}>
                      ${product.price}
                    </span>
                    <button style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                backgroundColor: currentPage === 1 ? '#f8f9fa' : 'white',
                color: currentPage === 1 ? '#6c757d' : '#007bff',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                borderRadius: '4px'
              }}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #ddd',
                    backgroundColor: currentPage === page ? '#007bff' : 'white',
                    color: currentPage === page ? 'white' : '#007bff',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                backgroundColor: currentPage === totalPages ? '#f8f9fa' : 'white',
                color: currentPage === totalPages ? '#6c757d' : '#007bff',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                borderRadius: '4px'
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          padding: '2rem 0',
          color: '#6c757d',
          borderTop: '1px solid #e9ecef',
          marginTop: '2rem'
        }}>
          <p style={{ margin: 0 }}>
            🚀 <strong>Search-as-Code Demo</strong> - AI-Enhanced Multi-Domain E-commerce Search
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
            Powered by Weaviate Vector Database & OpenAI Embeddings
          </p>
        </footer>
      </div>
    </div>
  );
}
