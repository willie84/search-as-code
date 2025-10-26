import { useState, useEffect } from 'react';

export default function RankingDemo({ sessionId, onProductView, onProductClick }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('dress');
    const [selectedDomain, setSelectedDomain] = useState('clothing');
    const [rankingConfig, setRankingConfig] = useState({
        relevance: 0.6,
        personalization: 0.3,
        business_priority: 0.1
    });
    const [retrievalConfig, setRetrievalConfig] = useState({
        semantic: 0.4,
        keyword: 0.2,
        visual: 0.4
    });

    const domains = [
        { id: 'clothing', name: '👗 Clothing', color: '#ff6b6b' },
        { id: 'electronics', name: '📱 Electronics', color: '#4ecdc4' },
        { id: 'furniture', name: '🪑 Furniture', color: '#45b7d1' },
        { id: 'groceries', name: '🛒 Groceries', color: '#96ceb4' }
    ];

    const fetchRankedResults = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/ranking-demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                },
                body: JSON.stringify({
                    query: searchQuery,
                    domain: selectedDomain,
                    limit: 10,
                    ranking_weights: rankingConfig,
                    retrieval_weights: retrievalConfig
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }
            
            const data = await response.json();
            setProducts(data.results || []);
            
        } catch (err) {
            setError(err.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId && searchQuery) {
            fetchRankedResults();
        }
    }, [sessionId, searchQuery, selectedDomain]);

    const handleConfigChange = (type, key, value) => {
        if (type === 'ranking') {
            setRankingConfig(prev => ({
                ...prev,
                [key]: parseFloat(value)
            }));
        } else if (type === 'retrieval') {
            setRetrievalConfig(prev => ({
                ...prev,
                [key]: parseFloat(value)
            }));
        }
    };

    const getDomainConfig = (domain) => {
        const configs = {
            clothing: {
                ranking: { relevance: 0.6, personalization: 0.3, business_priority: 0.1 },
                retrieval: { semantic: 0.4, keyword: 0.2, visual: 0.4 },
                factors: ['style_matching', 'occasion_fit', 'size_availability', 'trend_relevance']
            },
            electronics: {
                ranking: { relevance: 0.7, personalization: 0.2, business_priority: 0.1 },
                retrieval: { semantic: 0.5, keyword: 0.3, visual: 0.2 },
                factors: ['brand_preference', 'spec_matching', 'price_range', 'reviews']
            },
            furniture: {
                ranking: { relevance: 0.5, personalization: 0.2, business_priority: 0.3 },
                retrieval: { semantic: 0.3, keyword: 0.4, visual: 0.3 },
                factors: ['room_matching', 'style_compatibility', 'size_fit', 'durability']
            },
            groceries: {
                ranking: { relevance: 0.8, personalization: 0.1, business_priority: 0.1 },
                retrieval: { semantic: 0.6, keyword: 0.3, visual: 0.1 },
                factors: ['freshness', 'price_value', 'brand_trust', 'nutritional_value']
            }
        };
        return configs[domain] || configs.clothing;
    };

    const currentDomainConfig = getDomainConfig(selectedDomain);

    return (
        <div style={{ padding: '20px' }}>
            {/* Header */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '30px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                <h2 style={{
                    margin: '0 0 20px 0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                }}>
                    🎯 Search-as-Code Ranking Demo
                </h2>
                <p style={{ textAlign: 'center', color: '#666', margin: '0 0 30px 0' }}>
                    See how different ranking configurations affect search results in real-time
                </p>
            </div>

            {/* Search and Domain Selection */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '30px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                            Search Query:
                        </label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '25px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                        />
                    </div>
                    
                    <div style={{ minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                            Domain:
                        </label>
                        <select
                            value={selectedDomain}
                            onChange={(e) => setSelectedDomain(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '25px',
                                fontSize: '1rem',
                                outline: 'none',
                                background: 'white'
                            }}
                        >
                            {domains.map(domain => (
                                <option key={domain.id} value={domain.id}>
                                    {domain.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <button
                        onClick={fetchRankedResults}
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '25px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            opacity: loading ? 0.7 : 1,
                            transition: 'opacity 0.3s ease'
                        }}
                    >
                        {loading ? '🔄 Searching...' : '🔍 Search'}
                    </button>
                </div>
            </div>

            {/* Ranking Configuration */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '30px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '1.5rem' }}>
                    ⚙️ Ranking Configuration
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {/* Ranking Weights */}
                    <div>
                        <h4 style={{ margin: '0 0 15px 0', color: '#555' }}>Ranking Weights</h4>
                        {Object.entries(currentDomainConfig.ranking).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>
                                    {key.replace('_', ' ').toUpperCase()}: {rankingConfig[key]}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={rankingConfig[key]}
                                    onChange={(e) => handleConfigChange('ranking', key, e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '6px',
                                        borderRadius: '3px',
                                        background: '#e1e5e9',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    
                    {/* Retrieval Weights */}
                    <div>
                        <h4 style={{ margin: '0 0 15px 0', color: '#555' }}>Retrieval Weights</h4>
                        {Object.entries(currentDomainConfig.retrieval).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>
                                    {key.toUpperCase()}: {retrievalConfig[key]}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={retrievalConfig[key]}
                                    onChange={(e) => handleConfigChange('retrieval', key, e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '6px',
                                        borderRadius: '3px',
                                        background: '#e1e5e9',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Domain Factors */}
                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#555' }}>Domain-Specific Factors</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {currentDomainConfig.factors.map(factor => (
                            <span key={factor} style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                {factor.replace('_', ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search Results */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '1.5rem' }}>
                    📊 Search Results
                </h3>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{
                            display: 'inline-block',
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #667eea',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '20px'
                        }}></div>
                        <p style={{ color: '#666', margin: '0' }}>Searching with current configuration...</p>
                    </div>
                ) : error ? (
                    <div style={{ color: '#ff6b6b', textAlign: 'center', padding: '20px' }}>
                        ❌ Error: {error}
                    </div>
                ) : (
                    <div>
                        <div style={{ marginBottom: '20px', color: '#666' }}>
                            Found {products.length} results for "{searchQuery}" in {selectedDomain} domain
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {products.map((product, index) => (
                                <div key={product.id} style={{
                                    background: 'white',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.borderColor = 'transparent';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                                onClick={() => onProductClick && onProductClick(product.id)}
                                onMouseOver={() => onProductView && onProductView(product.id)}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '15px'
                                    }}>
                                        <span style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            #{index + 1}
                                        </span>
                                        <span style={{
                                            background: '#f8f9fa',
                                            color: '#666',
                                            padding: '4px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem'
                                        }}>
                                            Score: {product.score?.toFixed(3) || 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <h4 style={{
                                        margin: '0 0 10px 0',
                                        color: '#333',
                                        fontSize: '1.1rem',
                                        lineHeight: '1.4'
                                    }}>
                                        {product.title}
                                    </h4>
                                    
                                    <p style={{
                                        margin: '0 0 15px 0',
                                        color: '#666',
                                        fontSize: '0.9rem',
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
                                        alignItems: 'center'
                                    }}>
                                        <span style={{
                                            background: '#28a745',
                                            color: 'white',
                                            padding: '6px 12px',
                                            borderRadius: '15px',
                                            fontSize: '1rem',
                                            fontWeight: 'bold'
                                        }}>
                                            ${product.price}
                                        </span>
                                        
                                        {product.domain && (
                                            <span style={{
                                                background: domains.find(d => d.id === product.domain)?.color || '#667eea',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '10px',
                                                fontSize: '0.8rem'
                                            }}>
                                                {product.domain}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
