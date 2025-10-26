import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchBar from '../components/SearchBar';
import ProductGrid from '../components/ProductGrid';
import PersonalizedLanding from '../components/PersonalizedLanding';
import ProductBrowser from '../components/ProductBrowser';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication and create session on component mount
  useEffect(() => {
    const initializeApp = async () => {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      // Create session for anonymous users
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
    initializeApp();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const handleSearch = async (query) => {
    if (!sessionId) {
      console.error('No session available');
      return;
    }

    setSearchQuery(query);
    setLoading(true);
    try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'X-Session-ID': sessionId
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '20px 0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ 
              margin: '0',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}>
              🛍️ SmartSearch
            </h1>
            <p style={{ 
              margin: '10px 0 0 0',
              color: '#666',
              fontSize: '1.1rem'
            }}>
              AI-Powered Product Discovery
            </p>
            <div style={{ 
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                color: sessionId ? '#28a745' : '#ffc107',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {sessionId ? '🟢 Connected' : '🟡 Connecting...'}
              </span>
              
              {isAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    👋 Welcome, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={() => router.push('/login')}
                    style={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Login / Sign Up
                  </button>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => router.push('/ranking-simple')}
                      style={{
                        background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      🎯 Ranking Demo
                    </button>
                    
                    <button
                      onClick={() => router.push('/ranking-comparison')}
                      style={{
                        background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      ⚖️ Compare
                    </button>
                    
                    <button
                      onClick={() => router.push('/ad-demo')}
                      style={{
                        background: 'linear-gradient(45deg, #ffc107, #ff8c00)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      💰 Ad Demo
                    </button>
                    
                    <button
                      onClick={() => router.push('/unified-demo')}
                      style={{
                        background: 'linear-gradient(45deg, #28a745, #20c997)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      🔗 Unified Demo
                    </button>
                    
                    <button
                      onClick={() => router.push('/how-it-works')}
                      style={{
                        background: 'linear-gradient(45deg, #6f42c1, #e83e8c)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      📚 How It Works
                    </button>
                    
                    <button
                      onClick={() => router.push('/config-comparison')}
                      style={{
                        background: 'linear-gradient(45deg, #17a2b8, #138496)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      🔬 Compare Configs
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Search Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0',
            color: '#333',
            fontSize: '1.8rem'
          }}>
            What are you looking for?
          </h2>
          <p style={{ 
            margin: '0 0 30px 0',
            color: '#666',
            fontSize: '1.1rem'
          }}>
            Search for anything - clothes, electronics, furniture, groceries, and more!
          </p>
      <SearchBar onSearch={handleSearch} />
        </div>

        {/* Results Section */}
        {searchQuery && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0',
              color: '#333',
              fontSize: '1.5rem'
            }}>
              {loading ? '🔍 Searching...' : `🎯 Results for "${searchQuery}"`}
            </h3>
            
            {loading ? (
              <div style={{ 
                textAlign: 'center',
                padding: '60px 0',
                color: '#666'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px'
                }}></div>
                <p>Finding the best products for you...</p>
              </div>
            ) : (
              <ProductGrid 
                products={products} 
                onProductView={(productId) => {
                  // Track product view for search results
                  if (sessionId) {
                    fetch('/api/track', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'X-Session-ID': sessionId },
                      body: JSON.stringify({ action: 'view', productId })
                    }).catch(console.error);
                  }
                }}
                onProductClick={(productId) => {
                  // Track product click for search results
                  if (sessionId) {
                    fetch('/api/track', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'X-Session-ID': sessionId },
                      body: JSON.stringify({ action: 'click', productId })
                    }).catch(console.error);
                  }
                }}
              />
            )}
          </div>
        )}

        {/* Product Browser */}
        {sessionId && (
          <ProductBrowser 
            sessionId={sessionId}
            onProductView={(productId) => {
              if (sessionId) {
                fetch('/api/track', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                  },
                  body: JSON.stringify({
                    type: 'view',
                    product_id: productId
                  })
                }).catch(console.error);
              }
            }}
            onProductClick={(productId) => {
              if (sessionId) {
                fetch('/api/track', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                  },
                  body: JSON.stringify({
                    type: 'click',
                    product_id: productId
                  })
                }).catch(console.error);
              }
            }}
          />
        )}

        {/* Welcome Message for new users */}
        {!sessionId && !loading && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '60px 40px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
            <h3 style={{ 
              margin: '0 0 20px 0',
              color: '#333',
              fontSize: '1.8rem'
            }}>
              Discover Amazing Products
            </h3>
            <p style={{ 
              margin: '0 0 30px 0',
              color: '#666',
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              Our AI-powered search understands what you're looking for and finds the perfect products across all categories.
            </p>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                👕 Fashion
              </div>
              <div style={{
                background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                🍎 Groceries
              </div>
              <div style={{
                background: 'linear-gradient(45deg, #a8edea, #fed6e3)',
                color: '#333',
                padding: '15px 25px',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                🪑 Furniture
              </div>
              <div style={{
                background: 'linear-gradient(45deg, #ffecd2, #fcb69f)',
                color: '#333',
                padding: '15px 25px',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                📱 Electronics
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}