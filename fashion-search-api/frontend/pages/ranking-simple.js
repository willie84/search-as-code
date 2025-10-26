import { useState, useEffect } from 'react';

export default function RankingSimple() {
    const [sessionId, setSessionId] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('women');
    const [rankingConfig, setRankingConfig] = useState({
        relevance: 0.6,
        personalization: 0.3,
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

    const searchWithRanking = async () => {
        if (!sessionId) return;
        
        setLoading(true);
        try {
            const response = await fetch('/api/ranking-demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                },
                body: JSON.stringify({
                    query,
                    domain: 'clothing',
                    limit: 5,
                    ranking_weights: rankingConfig
                })
            });
            
            const data = await response.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId) {
            searchWithRanking();
        }
    }, [sessionId, rankingConfig]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '1000px',
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
                    🎯 Search-as-Code Ranking Demo
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

                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ margin: '0 0 20px 0' }}>Ranking Configuration</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        {Object.entries(rankingConfig).map(([key, value]) => (
                            <div key={key}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>
                                    {key.replace('_', ' ').toUpperCase()}: {value}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={value}
                                    onChange={(e) => setRankingConfig(prev => ({
                                        ...prev,
                                        [key]: parseFloat(e.target.value)
                                    }))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={searchWithRanking}
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
                        {loading ? '🔄 Searching...' : '🔍 Search'}
                    </button>
                </div>

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
                                    background: 'white',
                                    borderRadius: '10px',
                                    padding: '20px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    border: '2px solid transparent'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
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
                                            Score: {result.score?.toFixed(3)}
                                        </span>
                                    </div>
                                    
                                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                        {result.title}
                                    </h4>
                                    
                                    <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>
                                        {result.description?.substring(0, 150)}...
                                    </p>
                                    
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
                                        
                                        {result.ranking_breakdown && (
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                <div>Relevance: {(result.ranking_breakdown.relevance * 100).toFixed(0)}%</div>
                                                <div>Personalization: {(result.ranking_breakdown.personalization * 100).toFixed(0)}%</div>
                                                <div>Business: {(result.ranking_breakdown.business_priority * 100).toFixed(0)}%</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <h4 style={{ margin: '0 0 15px 0' }}>How Search-as-Code Works:</h4>
                    <ul style={{ margin: '0', paddingLeft: '20px', color: '#666' }}>
                        <li>Adjust the ranking weights above to see how they affect search results</li>
                        <li>Higher relevance weight prioritizes text similarity</li>
                        <li>Higher personalization weight considers user preferences</li>
                        <li>Higher business priority weight promotes sponsored/featured items</li>
                        <li>The search.yaml configuration controls these weights per domain</li>
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
