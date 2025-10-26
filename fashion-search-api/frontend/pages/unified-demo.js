import { useState, useEffect } from 'react';

export default function UnifiedDemo() {
    const [sessionId, setSessionId] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('women');
    
    // Search Algorithm Configuration
    const [searchAlgorithm, setSearchAlgorithm] = useState('hybrid');
    
    // Ranking Configuration
    const [rankingWeights, setRankingWeights] = useState({
        relevance: 0.6,
        personalization: 0.3,
        business_priority: 0.1
    });
    
    // Ad Configuration
    const [adIntegration, setAdIntegration] = useState(true);
    const [adBudget, setAdBudget] = useState(0.3);
    const [userSegment, setUserSegment] = useState('standard');
    
    // Boost Factors
    const [boostFactors, setBoostFactors] = useState({
        'sale': 0.2,
        'new': 0.15,
        'premium': 0.1
    });
    
    // Results metadata
    const [searchMetadata, setSearchMetadata] = useState({});
    const [rankingBreakdown, setRankingBreakdown] = useState({});
    const [adBreakdown, setAdBreakdown] = useState({});
    const [algorithmPerformance, setAlgorithmPerformance] = useState({});

    useEffect(() => {
        const initializeSession = async () => {
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
        initializeSession();
    }, []);

    const executeUnifiedSearch = async () => {
        if (!sessionId) return;
        
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/unified/unified-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                },
                body: JSON.stringify({
                    query,
                    domain: 'clothing',
                    limit: 8,
                    search_algorithm: searchAlgorithm,
                    ranking_weights: rankingWeights,
                    ad_integration: adIntegration,
                    ad_budget: adBudget,
                    user_segment: userSegment,
                    boost_factors: boostFactors
                })
            });
            
            const data = await response.json();
            setResults(data.results || []);
            setSearchMetadata(data.search_metadata || {});
            setRankingBreakdown(data.ranking_breakdown || {});
            setAdBreakdown(data.ad_breakdown || {});
            setAlgorithmPerformance(data.algorithm_performance || {});
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId) {
            executeUnifiedSearch();
        }
    }, [sessionId, searchAlgorithm, rankingWeights, adIntegration, adBudget, userSegment, boostFactors]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    margin: '0 0 30px 0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2.5rem',
                    fontWeight: 'bold'
                }}>
                    🔗 Unified Search-as-Code Demo
                </h1>

                <p style={{ textAlign: 'center', color: '#666', margin: '0 0 30px 0', fontSize: '1.1rem' }}>
                    See how search algorithms, ranking, and ad campaigns work together in one unified system
                </p>

                {/* Search Query */}
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                        Search Query:
                    </label>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e1e5e9',
                            borderRadius: '10px',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                {/* Preset Scenarios */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>🎯 Preset Scenarios</h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => {
                                setRankingWeights({ relevance: 0.3, personalization: 0.2, business_priority: 0.5 });
                                setBoostFactors({ sale: 0.4, new: 0.1 });
                                setAdBudget(0.3);
                                setUserSegment('standard');
                                setQuery('sale');
                            }}
                            style={{
                                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            🛍️ Black Friday Revenue
                        </button>
                        <button
                            onClick={() => {
                                setRankingWeights({ relevance: 0.3, personalization: 0.5, business_priority: 0.2 });
                                setBoostFactors({ sale: 0.1, new: 0.2 });
                                setAdBudget(0.2);
                                setUserSegment('premium');
                                setQuery('women');
                            }}
                            style={{
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            👑 Premium Experience
                        </button>
                        <button
                            onClick={() => {
                                setRankingWeights({ relevance: 0.6, personalization: 0.3, business_priority: 0.1 });
                                setBoostFactors({ sale: 0.2, new: 0.0 });
                                setAdBudget(0.1);
                                setUserSegment('standard');
                                setQuery('bag');
                            }}
                            style={{
                                background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            💰 Budget-Conscious
                        </button>
                        <button
                            onClick={() => {
                                setRankingWeights({ relevance: 0.4, personalization: 0.1, business_priority: 0.5 });
                                setBoostFactors({ sale: 0.0, new: 0.4 });
                                setAdBudget(0.4);
                                setUserSegment('premium');
                                setQuery('handbag');
                            }}
                            style={{
                                background: 'linear-gradient(45deg, #ffc107, #ff8c00)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            🚀 New Product Launch
                        </button>
                    </div>
                </div>

                {/* Configuration Panels */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    
                    {/* Search Algorithm */}
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '15px',
                        padding: '20px',
                        border: '2px solid #667eea'
                    }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#667eea' }}>🔍 Search Algorithm</h3>
                        <select
                            value={searchAlgorithm}
                            onChange={(e) => setSearchAlgorithm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="semantic">Semantic Search (Vector Similarity)</option>
                            <option value="keyword">Keyword Search (BM25)</option>
                            <option value="hybrid">Hybrid Search (Combined)</option>
                        </select>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                            {searchAlgorithm === 'semantic' && 'Uses AI embeddings for meaning-based search'}
                            {searchAlgorithm === 'keyword' && 'Uses traditional keyword matching'}
                            {searchAlgorithm === 'hybrid' && 'Combines semantic and keyword approaches'}
                        </div>
                    </div>

                    {/* Ranking Weights */}
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '15px',
                        padding: '20px',
                        border: '2px solid #ff6b6b'
                    }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#ff6b6b' }}>⚖️ Ranking Weights</h3>
                        {Object.entries(rankingWeights).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>
                                    {key.replace('_', ' ').toUpperCase()}: {value}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={value}
                                    onChange={(e) => setRankingWeights(prev => ({
                                        ...prev,
                                        [key]: parseFloat(e.target.value)
                                    }))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Ad Configuration */}
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '15px',
                        padding: '20px',
                        border: '2px solid #ffc107'
                    }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#ff8c00' }}>💰 Ad Integration</h3>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={adIntegration}
                                    onChange={(e) => setAdIntegration(e.target.checked)}
                                />
                                Enable Ad Integration
                            </label>
                        </div>
                        {adIntegration && (
                            <>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>
                                        Ad Budget: {Math.round(adBudget * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="0.5"
                                        step="0.1"
                                        value={adBudget}
                                        onChange={(e) => setAdBudget(parseFloat(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>
                                        User Segment:
                                    </label>
                                    <select
                                        value={userSegment}
                                        onChange={(e) => setUserSegment(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '2px solid #e1e5e9',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <option value="new_user">New User</option>
                                        <option value="standard">Standard User</option>
                                        <option value="premium">Premium User</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Boost Factors */}
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '15px',
                        padding: '20px',
                        border: '2px solid #28a745'
                    }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#28a745' }}>🚀 Boost Factors</h3>
                        {Object.entries(boostFactors).map(([keyword, boost]) => (
                            <div key={keyword} style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>
                                    "{keyword}": +{boost}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="0.5"
                                    step="0.05"
                                    value={boost}
                                    onChange={(e) => setBoostFactors(prev => ({
                                        ...prev,
                                        [keyword]: parseFloat(e.target.value)
                                    }))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Metrics */}
                <div style={{
                    background: '#e8f4fd',
                    borderRadius: '15px',
                    padding: '20px',
                    marginBottom: '30px',
                    border: '2px solid #0066cc'
                }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#0066cc' }}>📊 Performance Metrics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                                {algorithmPerformance.processing_time?.toFixed(1) || 0}ms
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Search Time</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                                {searchMetadata.total_results || 0}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Results</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
                                {adBreakdown.total_ads || 0}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Sponsored Ads</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                                ${adBreakdown.ad_revenue_estimate?.toFixed(2) || 0}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Ad Revenue</div>
                        </div>
                    </div>
                </div>

                {/* Search Results */}
                <div>
                    <h3 style={{ margin: '0 0 20px 0' }}>Search Results</h3>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                border: '4px solid #f3f3f3',
                                borderTop: '4px solid #667eea',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {results.map((result, index) => (
                                <div key={result.id} style={{
                                    background: result.is_sponsored ? '#fff3cd' : 'white',
                                    borderRadius: '10px',
                                    padding: '20px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    border: result.is_sponsored ? '3px solid #ffc107' : '2px solid transparent',
                                    position: 'relative'
                                }}>
                                    {result.is_sponsored && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: '#ffc107',
                                            color: '#000',
                                            padding: '4px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            💰 SPONSORED
                                        </div>
                                    )}
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{
                                            background: result.is_sponsored ? '#ffc107' : '#667eea',
                                            color: result.is_sponsored ? '#000' : 'white',
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
                                            Score: {result.score?.toFixed(3)}
                                        </span>
                                    </div>
                                    
                                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                        {result.title}
                                    </h4>
                                    
                                    <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>
                                        {result.description}
                                    </p>
                                    
                                    {result.ranking_breakdown && (
                                        <div style={{
                                            background: '#f8f9fa',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            marginBottom: '10px',
                                            fontSize: '0.8rem'
                                        }}>
                                            <div><strong>Relevance:</strong> {(result.ranking_breakdown.relevance * 100).toFixed(0)}%</div>
                                            <div><strong>Personalization:</strong> {(result.ranking_breakdown.personalization * 100).toFixed(0)}%</div>
                                            <div><strong>Business Priority:</strong> {(result.ranking_breakdown.business_priority * 100).toFixed(0)}%</div>
                                        </div>
                                    )}
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{
                                            background: '#28a745',
                                            color: 'white',
                                            padding: '6px 12px',
                                            borderRadius: '15px',
                                            fontSize: '1rem',
                                            fontWeight: 'bold'
                                        }}>
                                            ${result.price}
                                        </span>
                                        
                                        {result.is_sponsored && (
                                            <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'right' }}>
                                                <div>Bid: ${result.bid_amount}</div>
                                                <div>CTR: {(result.ctr_estimate * 100).toFixed(1)}%</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '30px', padding: '20px', background: '#e8f5e8', borderRadius: '10px' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#28a745' }}>🔗 How Everything Works Together:</h4>
                    <ol style={{ margin: '0', paddingLeft: '20px', color: '#333' }}>
                        <li><strong>Search Algorithm:</strong> Finds relevant products using semantic, keyword, or hybrid approaches</li>
                        <li><strong>Ranking Algorithm:</strong> Scores and ranks results based on relevance, personalization, and business priorities</li>
                        <li><strong>Boost Factors:</strong> Additional scoring boosts for specific keywords or product attributes</li>
                        <li><strong>Ad Integration:</strong> Sponsored content is inserted based on bid amounts and user segmentation</li>
                        <li><strong>Final Results:</strong> Organic and sponsored results are combined and presented to the user</li>
                    </ol>
                </div>
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
