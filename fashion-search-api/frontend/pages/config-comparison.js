import { useState, useEffect } from 'react';

export default function ConfigComparison() {
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({});

    const testConfigurations = [
        {
            id: 1,
            name: "High Relevance",
            description: "Focus on search relevance only",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.9, "personalization": 0.0, "business_priority": 0.1},
                ad_integration: false,
                ad_budget: 0.0,
                user_segment: "standard",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 2,
            name: "High Personalization",
            description: "Focus on user preferences",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.1, "personalization": 0.8, "business_priority": 0.1},
                ad_integration: false,
                ad_budget: 0.0,
                user_segment: "premium",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 3,
            name: "High Business Priority",
            description: "Focus on business objectives",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.1, "personalization": 0.0, "business_priority": 0.9},
                ad_integration: false,
                ad_budget: 0.0,
                user_segment: "standard",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 4,
            name: "With Sale Boost",
            description: "Boost products with 'sale' keyword",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: false,
                ad_budget: 0.0,
                user_segment: "standard",
                boost_factors: {"sale": 0.3, "new": 0.0}
            }
        },
        {
            id: 5,
            name: "With New Boost",
            description: "Boost products with 'new' keyword",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: false,
                ad_budget: 0.0,
                user_segment: "standard",
                boost_factors: {"sale": 0.0, "new": 0.3}
            }
        },
        {
            id: 6,
            name: "With Ads (10%)",
            description: "Low ad budget integration",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: true,
                ad_budget: 0.1,
                user_segment: "standard",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 7,
            name: "With Ads (40%)",
            description: "High ad budget integration",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: true,
                ad_budget: 0.4,
                user_segment: "premium",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 8,
            name: "Keyword Search",
            description: "Traditional keyword matching",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "keyword",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: false,
                ad_budget: 0.0,
                user_segment: "standard",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 9,
            name: "Hybrid Search",
            description: "Combined semantic + keyword",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "hybrid",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: false,
                ad_budget: 0.0,
                user_segment: "standard",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 10,
            name: "New User Segment",
            description: "Targeting new users",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: true,
                ad_budget: 0.3,
                user_segment: "new_user",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 11,
            name: "Premium User Segment",
            description: "Targeting premium users",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: true,
                ad_budget: 0.3,
                user_segment: "premium",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 12,
            name: "Electronics Domain",
            description: "Electronics-specific ranking",
            config: {
                query: "women",
                domain: "electronics",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: false,
                ad_budget: 0.0,
                user_segment: "standard",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 13,
            name: "Furniture Domain",
            description: "Furniture-specific ranking",
            config: {
                query: "women",
                domain: "furniture",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: false,
                ad_budget: 0.0,
                user_segment: "standard",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 14,
            name: "Groceries Domain",
            description: "Groceries-specific ranking",
            config: {
                query: "women",
                domain: "groceries",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: false,
                ad_budget: 0.0,
                user_segment: "standard",
                boost_factors: {"sale": 0.0, "new": 0.0}
            }
        },
        {
            id: 15,
            name: "Combined Boost Factors",
            description: "Multiple boost factors active",
            config: {
                query: "women",
                domain: "clothing",
                limit: 3,
                search_algorithm: "semantic",
                ranking_weights: {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                ad_integration: true,
                ad_budget: 0.3,
                user_segment: "premium",
                boost_factors: {"sale": 0.2, "new": 0.2, "premium": 0.3}
            }
        }
    ];

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

    const runAllTests = async () => {
        if (!sessionId) return;
        
        setLoading(true);
        const testResults = {};
        
        for (const test of testConfigurations) {
            try {
                const response = await fetch('/api/unified-search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Session-ID': sessionId
                    },
                    body: JSON.stringify(test.config)
                });
                
                const data = await response.json();
                testResults[test.id] = {
                    ...test,
                    results: data.results || [],
                    metadata: data.search_metadata || {},
                    ranking: data.ranking_breakdown || {},
                    ads: data.ad_breakdown || {}
                };
            } catch (error) {
                console.error(`Error in test ${test.id}:`, error);
                testResults[test.id] = {
                    ...test,
                    results: [],
                    error: error.message
                };
            }
        }
        
        setResults(testResults);
        setLoading(false);
    };

    useEffect(() => {
        if (sessionId) {
            runAllTests();
        }
    }, [sessionId]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '1600px',
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
                    🔬 Search Configuration Comparison
                </h1>

                <p style={{ textAlign: 'center', color: '#666', margin: '0 0 30px 0', fontSize: '1.1rem' }}>
                    15 different search configurations showing how search-as-code affects results
                </p>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <div style={{
                            display: 'inline-block',
                            width: '50px',
                            height: '50px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #667eea',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '20px' }}>
                            Running 15 different search configurations...
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                        {testConfigurations.map((test) => {
                            const result = results[test.id];
                            return (
                                <div key={test.id} style={{
                                    background: '#f8f9fa',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    border: '2px solid #e9ecef',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.2rem' }}>
                                        {test.id}. {test.name}
                                    </h3>
                                    <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '0.9rem' }}>
                                        {test.description}
                                    </p>
                                    
                                    {result?.error ? (
                                        <div style={{ color: 'red', fontSize: '0.9rem' }}>
                                            Error: {result.error}
                                        </div>
                                    ) : (
                                        <div>
                                            {/* Configuration Summary */}
                                            <div style={{
                                                background: '#e8f4fd',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                marginBottom: '15px',
                                                fontSize: '0.8rem'
                                            }}>
                                                <div><strong>Algorithm:</strong> {test.config.search_algorithm}</div>
                                                <div><strong>Weights:</strong> R:{test.config.ranking_weights.relevance} P:{test.config.ranking_weights.personalization} B:{test.config.ranking_weights.business_priority}</div>
                                                <div><strong>Ads:</strong> {test.config.ad_integration ? `${Math.round(test.config.ad_budget * 100)}%` : 'None'}</div>
                                                <div><strong>User:</strong> {test.config.user_segment}</div>
                                            </div>
                                            
                                            {/* Results */}
                                            <div>
                                                <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1rem' }}>
                                                    Top Results:
                                                </h4>
                                                {result?.results?.slice(0, 3).map((item, index) => (
                                                    <div key={index} style={{
                                                        background: item.is_sponsored ? '#fff3cd' : 'white',
                                                        padding: '8px',
                                                        borderRadius: '6px',
                                                        marginBottom: '8px',
                                                        border: item.is_sponsored ? '2px solid #ffc107' : '1px solid #e9ecef',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                            <span style={{
                                                                background: item.is_sponsored ? '#ffc107' : '#667eea',
                                                                color: item.is_sponsored ? '#000' : 'white',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                #{index + 1}
                                                            </span>
                                                            <span style={{ fontSize: '0.7rem', color: '#666' }}>
                                                                Score: {item.score?.toFixed(3)}
                                                            </span>
                                                        </div>
                                                        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                                                            {item.title?.substring(0, 60)}...
                                                        </div>
                                                        {item.is_sponsored && (
                                                            <div style={{ fontSize: '0.7rem', color: '#ff8c00', fontWeight: 'bold' }}>
                                                                💰 SPONSORED
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Performance Metrics */}
                                            {result?.metadata && (
                                                <div style={{
                                                    background: '#e8f5e8',
                                                    padding: '8px',
                                                    borderRadius: '6px',
                                                    marginTop: '10px',
                                                    fontSize: '0.7rem'
                                                }}>
                                                    <div><strong>Processing:</strong> {result.metadata.processing_time_ms?.toFixed(1)}ms</div>
                                                    <div><strong>Total Results:</strong> {result.metadata.total_results}</div>
                                                    <div><strong>Sponsored:</strong> {result.metadata.sponsored_results}</div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: '#e8f4fd',
                    borderRadius: '15px',
                    border: '2px solid #0066cc'
                }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#0066cc' }}>🎯 Key Observations:</h4>
                    <ul style={{ margin: '0', paddingLeft: '20px', color: '#333' }}>
                        <li><strong>Ranking Weights:</strong> Different weight combinations dramatically change result order</li>
                        <li><strong>Boost Factors:</strong> Keywords like "sale" and "new" significantly boost relevant products</li>
                        <li><strong>Ad Integration:</strong> Higher ad budgets insert more sponsored content</li>
                        <li><strong>User Segments:</strong> Premium users see higher-value ads with increased bids</li>
                        <li><strong>Domain-Specific:</strong> Different domains apply different ranking rules</li>
                        <li><strong>Search Algorithms:</strong> Semantic, keyword, and hybrid approaches yield different results</li>
                    </ul>
                </div>

                <div style={{
                    marginTop: '20px',
                    textAlign: 'center'
                }}>
                    <button
                        onClick={runAllTests}
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '25px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? '🔄 Running Tests...' : '🔄 Run Tests Again'}
                    </button>
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
