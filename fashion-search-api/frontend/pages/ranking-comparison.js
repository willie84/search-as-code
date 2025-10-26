import { useState, useEffect } from 'react';

export default function RankingComparison() {
    const [sessionId, setSessionId] = useState(null);
    const [resultsA, setResultsA] = useState([]);
    const [resultsB, setResultsB] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('women');
    
    const [configA, setConfigA] = useState({
        relevance: 0.8,
        personalization: 0.1,
        business_priority: 0.1
    });
    
    const [configB, setConfigB] = useState({
        relevance: 0.2,
        personalization: 0.7,
        business_priority: 0.1
    });

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

    const searchWithBothConfigs = async () => {
        if (!sessionId) return;
        
        setLoading(true);
        try {
            // Search with config A
            const responseA = await fetch('/api/ranking-demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                },
                body: JSON.stringify({
                    query,
                    domain: 'clothing',
                    limit: 5,
                    ranking_weights: configA
                })
            });
            
            // Search with config B
            const responseB = await fetch('/api/ranking-demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                },
                body: JSON.stringify({
                    query,
                    domain: 'clothing',
                    limit: 5,
                    ranking_weights: configB
                })
            });
            
            const dataA = await responseA.json();
            const dataB = await responseB.json();
            
            setResultsA(dataA.results || []);
            setResultsB(dataB.results || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId) {
            searchWithBothConfigs();
        }
    }, [sessionId, configA, configB]);

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
                    ⚖️ Ranking Comparison Demo
                </h1>

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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                    {/* Configuration A */}
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '15px',
                        padding: '20px',
                        border: '3px solid #667eea'
                    }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#667eea', textAlign: 'center' }}>
                            🔍 Configuration A: Relevance-Focused
                        </h3>
                        {Object.entries(configA).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>
                                    {key.replace('_', ' ').toUpperCase()}: {value}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={value}
                                    onChange={(e) => setConfigA(prev => ({
                                        ...prev,
                                        [key]: parseFloat(e.target.value)
                                    }))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Configuration B */}
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '15px',
                        padding: '20px',
                        border: '3px solid #ff6b6b'
                    }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#ff6b6b', textAlign: 'center' }}>
                            👤 Configuration B: Personalization-Focused
                        </h3>
                        {Object.entries(configB).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>
                                    {key.replace('_', ' ').toUpperCase()}: {value}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={value}
                                    onChange={(e) => setConfigB(prev => ({
                                        ...prev,
                                        [key]: parseFloat(e.target.value)
                                    }))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <button
                        onClick={searchWithBothConfigs}
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '25px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? '🔄 Comparing...' : '🔄 Refresh Comparison'}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {/* Results A */}
                    <div>
                        <h3 style={{ margin: '0 0 20px 0', color: '#667eea', textAlign: 'center' }}>
                            🔍 Relevance-Focused Results
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
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {resultsA.map((result, index) => (
                                    <div key={result.id} style={{
                                        background: 'white',
                                        borderRadius: '10px',
                                        padding: '15px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        border: '2px solid #667eea'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span style={{
                                                background: '#667eea',
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
                                                Score: {result.score?.toFixed(3)}
                                            </span>
                                        </div>
                                        
                                        <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '1rem' }}>
                                            {result.title}
                                        </h4>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{
                                                background: '#28a745',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '10px',
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold'
                                            }}>
                                                ${result.price}
                                            </span>
                                            
                                            {result.ranking_breakdown && (
                                                <div style={{ fontSize: '0.7rem', color: '#666', textAlign: 'right' }}>
                                                    <div>Rel: {(result.ranking_breakdown.relevance * 100).toFixed(0)}%</div>
                                                    <div>Per: {(result.ranking_breakdown.personalization * 100).toFixed(0)}%</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Results B */}
                    <div>
                        <h3 style={{ margin: '0 0 20px 0', color: '#ff6b6b', textAlign: 'center' }}>
                            👤 Personalization-Focused Results
                        </h3>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div style={{
                                    display: 'inline-block',
                                    width: '40px',
                                    height: '40px',
                                    border: '4px solid #f3f3f3',
                                    borderTop: '4px solid #ff6b6b',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {resultsB.map((result, index) => (
                                    <div key={result.id} style={{
                                        background: 'white',
                                        borderRadius: '10px',
                                        padding: '15px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        border: '2px solid #ff6b6b'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span style={{
                                                background: '#ff6b6b',
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
                                                Score: {result.score?.toFixed(3)}
                                            </span>
                                        </div>
                                        
                                        <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '1rem' }}>
                                            {result.title}
                                        </h4>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{
                                                background: '#28a745',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '10px',
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold'
                                            }}>
                                                ${result.price}
                                            </span>
                                            
                                            {result.ranking_breakdown && (
                                                <div style={{ fontSize: '0.7rem', color: '#666', textAlign: 'right' }}>
                                                    <div>Rel: {(result.ranking_breakdown.relevance * 100).toFixed(0)}%</div>
                                                    <div>Per: {(result.ranking_breakdown.personalization * 100).toFixed(0)}%</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '30px', padding: '20px', background: '#e8f4fd', borderRadius: '10px' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#0066cc' }}>🎯 What You're Seeing:</h4>
                    <ul style={{ margin: '0', paddingLeft: '20px', color: '#333' }}>
                        <li><strong>Left Side (Relevance-Focused):</strong> Results prioritize text similarity and keyword matching</li>
                        <li><strong>Right Side (Personalization-Focused):</strong> Results prioritize user preferences like price range and brand affinity</li>
                        <li><strong>Different Rankings:</strong> Notice how the same products appear in different orders based on the ranking configuration</li>
                        <li><strong>Score Breakdown:</strong> See how relevance vs personalization scores contribute to the final ranking</li>
                    </ul>
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
