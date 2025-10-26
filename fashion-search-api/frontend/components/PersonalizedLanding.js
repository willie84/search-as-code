import { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';

const PersonalizedLanding = ({ sessionId, user, isAuthenticated }) => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecommendations();
    }, [sessionId, user, isAuthenticated]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            
            // Don't fetch if no sessionId
            if (!sessionId) {
                setError('No session available');
                return;
            }
            
            // Use different endpoints based on authentication status
            const endpoint = isAuthenticated ? '/api/user/recommendations' : '/api/recommendations';
            const headers = {
                'X-Session-ID': sessionId
            };
            
            // Add authorization header for authenticated users
            if (isAuthenticated) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }
            
            const response = await fetch(endpoint, { headers });
            
            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }
            
            const data = await response.json();
            setRecommendations(data.data || data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const trackProductView = async (productId) => {
        try {
            if (isAuthenticated) {
                // Track for authenticated user
                const token = localStorage.getItem('token');
                await fetch('/api/user/track/behavior', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        behavior_type: 'view',
                        data: { product_id: productId }
                    })
                });
            } else if (sessionId) {
                // Track for anonymous user
                await fetch('/api/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Session-ID': sessionId
                    },
                    body: JSON.stringify({
                        action: 'view',
                        productId: productId
                    })
                });
            }
        } catch (error) {
            console.error('Error tracking view:', error);
        }
    };

    const trackProductClick = async (productId) => {
        try {
            if (isAuthenticated) {
                // Track for authenticated user
                const token = localStorage.getItem('token');
                await fetch('/api/user/track/behavior', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        behavior_type: 'click',
                        data: { product_id: productId }
                    })
                });
            } else if (sessionId) {
                // Track for anonymous user
                await fetch('/api/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Session-ID': sessionId
                    },
                    body: JSON.stringify({
                        action: 'click',
                        productId: productId
                    })
                });
            }
        } catch (error) {
            console.error('Error tracking click:', error);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                margin: '20px 0'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid rgba(255,255,255,0.3)',
                        borderTop: '4px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h3>Loading your personalized recommendations...</h3>
                    <p>We're curating the perfect products just for you!</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                margin: '20px 0'
            }}>
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button 
                    onClick={fetchRecommendations}
                    style={{
                        background: 'white',
                        color: '#ff6b6b',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!recommendations || !recommendations.sections || recommendations.sections.length === 0) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '40px',
                borderRadius: '20px',
                textAlign: 'center',
                margin: '20px 0'
            }}>
                <h2>Welcome to SmartSearch! 🎉</h2>
                <p>Start browsing to get personalized recommendations</p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '20px',
                    flexWrap: 'wrap'
                }}>
                    {['Fashion', 'Electronics', 'Furniture', 'Groceries'].map(category => (
                        <span key={category} style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px'
                        }}>
                            {category}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px 0' }}>
            {/* Welcome Message */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '20px',
                textAlign: 'center',
                marginBottom: '30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>
                    {isAuthenticated 
                        ? `Welcome back, ${user?.name}! 🎯` 
                        : 'Welcome to SmartSearch! 👋'
                    }
                </h1>
                <p style={{ margin: '0', fontSize: '1.2rem', opacity: 0.9 }}>
                    {isAuthenticated 
                        ? 'Here are your personalized recommendations based on your preferences'
                        : 'Discover amazing products tailored just for you'
                    }
                </p>
                <div style={{
                    marginTop: '20px',
                    fontSize: '14px',
                    opacity: 0.8
                }}>
                    {recommendations.total_products} products available
                </div>
            </div>

            {/* Recommendation Sections */}
            {recommendations.sections.map((section, index) => (
                <div key={index} style={{ marginBottom: '40px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px',
                        padding: '0 10px'
                    }}>
                        <h2 style={{
                            margin: '0',
                            fontSize: '1.8rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {section.title}
                        </h2>
                        <div style={{
                            flex: 1,
                            height: '2px',
                            background: 'linear-gradient(90deg, #667eea 0%, transparent 100%)',
                            marginLeft: '20px'
                        }}></div>
                    </div>
                    
                    <p style={{
                        margin: '0 0 20px 0',
                        color: '#666',
                        fontSize: '1rem',
                        padding: '0 10px'
                    }}>
                        {section.subtitle}
                    </p>

                    <ProductGrid 
                        products={section.products} 
                        onProductView={trackProductView}
                        onProductClick={trackProductClick}
                        showTitle={false}
                    />
                </div>
            ))}

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PersonalizedLanding;
