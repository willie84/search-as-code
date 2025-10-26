import { useState, useEffect } from 'react';

export default function AdDemo() {
    const [sessionId, setSessionId] = useState(null);
    const [results, setResults] = useState([]);
    const [adCampaigns, setAdCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('dress');
    const [adBudget, setAdBudget] = useState(0.3); // 30% of results can be ads
    const [userSegment, setUserSegment] = useState('standard');
    const [adRevenue, setAdRevenue] = useState(0);
    const [totalAds, setTotalAds] = useState(0);
    const [totalOrganic, setTotalOrganic] = useState(0);

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

    const searchWithAds = async () => {
        if (!sessionId) return;
        
        setLoading(true);
        try {
            const response = await fetch('/api/ad-campaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                },
                body: JSON.stringify({
                    query,
                    domain: 'clothing',
                    limit: 8,
                    ad_integration: true,
                    ad_budget: adBudget,
                    user_segment: userSegment
                })
            });
            
            const data = await response.json();
            setResults(data.results || []);
            setAdCampaigns(data.ad_campaigns || []);
            setAdRevenue(data.ad_revenue_estimate || 0);
            setTotalAds(data.total_ads || 0);
            setTotalOrganic(data.total_organic || 0);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId) {
            searchWithAds();
        }
    }, [sessionId, adBudget, userSegment]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '1200px',
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
                    💰 Ad Campaign Integration Demo
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
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                            Ad Budget: {Math.round(adBudget * 100)}% of results
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
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                            Higher budget = more ads in results
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                            User Segment:
                        </label>
                        <select
                            value={userSegment}
                            onChange={(e) => setUserSegment(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '10px',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="new_user">🆕 New User</option>
                            <option value="standard">👤 Standard User</option>
                            <option value="premium">⭐ Premium User</option>
                        </select>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                            Premium users see higher-value ads
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <button
                        onClick={searchWithAds}
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
                        {loading ? '🔄 Searching...' : '🔍 Search with Ads'}
                    </button>
                </div>

                {/* Ad Revenue Summary */}
                <div style={{
                    background: '#e8f5e8',
                    borderRadius: '15px',
                    padding: '20px',
                    marginBottom: '30px',
                    border: '2px solid #28a745'
                }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#28a745' }}>💰 Ad Revenue Summary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                                ${adRevenue.toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Estimated Revenue</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                                {totalAds}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Sponsored Results</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                                {totalOrganic}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Organic Results</div>
                        </div>
                    </div>
                </div>

                {/* Search Results */}
                <div>
                    <h3 style={{ margin: '0 0 20px 0' }}>Search Results with Ad Integration</h3>
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
                                    
                                    {result.is_sponsored && (
                                        <div style={{
                                            background: '#e8f5e8',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            marginBottom: '10px',
                                            fontSize: '0.8rem'
                                        }}>
                                            <div><strong>Advertiser:</strong> {result.advertiser}</div>
                                            <div><strong>Campaign:</strong> {result.campaign_type}</div>
                                            <div><strong>Bid:</strong> ${result.bid_amount}</div>
                                            <div><strong>Est. CTR:</strong> {(result.ctr_estimate * 100).toFixed(1)}%</div>
                                        </div>
                                    )}
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
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
                                            {result.original_price && (
                                                <span style={{
                                                    color: '#666',
                                                    textDecoration: 'line-through',
                                                    marginLeft: '10px',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    ${result.original_price}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {result.is_sponsored && result.ad_breakdown && (
                                            <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'right' }}>
                                                <div>Revenue: ${result.ad_breakdown.total_revenue.toFixed(2)}</div>
                                                <div>Est. Clicks: {result.ad_breakdown.estimated_clicks.toFixed(0)}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '30px', padding: '20px', background: '#e8f4fd', borderRadius: '10px' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#0066cc' }}>🎯 How Ad Integration Works:</h4>
                    <ul style={{ margin: '0', paddingLeft: '20px', color: '#333' }}>
                        <li><strong>Keyword Targeting:</strong> Ads are matched to search queries based on target keywords</li>
                        <li><strong>Bid-Based Ranking:</strong> Higher bids get better placement in search results</li>
                        <li><strong>User Segmentation:</strong> Premium users see higher-value ads with increased bids</li>
                        <li><strong>Revenue Optimization:</strong> System calculates estimated revenue based on CTR and bid amounts</li>
                        <li><strong>Transparent Labeling:</strong> All sponsored content is clearly marked for users</li>
                    </ul>
                    
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <a href="/ad-config-demo" style={{
                            background: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            ⚙️ View Configuration
                        </a>
                    </div>
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
