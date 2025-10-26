import { useState } from 'react';

export default function AdConfigDemo() {
    const [selectedSection, setSelectedSection] = useState('placement');

    const configSections = {
        placement: {
            title: "🎯 Ad Placement Rules",
            content: `# Ad placement rules
placement_rules:
  top_placement:
    enabled: true
    max_ads: 1
    min_bid_threshold: 2.0
    
  middle_placement:
    enabled: true
    max_ads: 2
    frequency: 3  # Insert ad after every 3 organic results`
        },
        segmentation: {
            title: "👥 User Segmentation",
            content: `# User segmentation for ad targeting
user_segments:
  new_user:
    bid_multiplier: 1.2
    max_ad_ratio: 0.3
    preferred_campaigns: ["brand_awareness"]
    
  premium_user:
    bid_multiplier: 1.5
    max_ad_ratio: 0.35
    preferred_campaigns: ["luxury", "premium"]`
        },
        domain: {
            title: "🏪 Domain-Specific Rules",
            content: `# Domain-specific ad rules
domain_rules:
  clothing:
    max_ad_ratio: 0.3
    preferred_campaigns: ["promotional", "seasonal_sale"]
    keyword_boost: ["sale", "discount", "new"]
    
  electronics:
    max_ad_ratio: 0.25
    preferred_campaigns: ["product_launch"]
    keyword_boost: ["new", "latest", "premium"]`
        },
        revenue: {
            title: "💰 Revenue Optimization",
            content: `# Revenue optimization
revenue_optimization:
  ctr_weight: 0.4
  bid_weight: 0.6
  user_value_weight: 0.3
  
# A/B testing configuration
ab_testing:
  enabled: true
  test_groups:
    - name: "high_ad_ratio"
      ad_ratio: 0.4
      traffic_percentage: 0.1`
        }
    };

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
                    ⚙️ Ad Campaign Configuration
                </h1>

                <p style={{ textAlign: 'center', color: '#666', margin: '0 0 30px 0', fontSize: '1.1rem' }}>
                    See how ad campaigns are configured using search-as-code principles
                </p>

                {/* Navigation */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {Object.entries(configSections).map(([key, section]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedSection(key)}
                            style={{
                                background: selectedSection === key ? 
                                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                                    'rgba(255, 255, 255, 0.8)',
                                color: selectedSection === key ? 'white' : '#333',
                                border: '2px solid #667eea',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>

                {/* Configuration Display */}
                <div style={{
                    background: '#f8f9fa',
                    borderRadius: '15px',
                    padding: '30px',
                    border: '2px solid #e9ecef'
                }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
                        {configSections[selectedSection].title}
                    </h3>
                    
                    <pre style={{
                        background: '#2d3748',
                        color: '#e2e8f0',
                        padding: '20px',
                        borderRadius: '10px',
                        overflow: 'auto',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        margin: '0'
                    }}>
                        {configSections[selectedSection].content}
                    </pre>
                </div>

                {/* Benefits Section */}
                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: '#e8f5e8',
                    borderRadius: '15px',
                    border: '2px solid #28a745'
                }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#28a745' }}>🎯 Benefits of Search-as-Code for Ad Campaigns:</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div>
                            <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>📊 Transparent Configuration</h5>
                            <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                                All ad rules are defined in version-controlled YAML files, making them transparent and auditable.
                            </p>
                        </div>
                        <div>
                            <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>🔄 Easy A/B Testing</h5>
                            <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                                Test different ad configurations by simply changing YAML values and deploying.
                            </p>
                        </div>
                        <div>
                            <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>🎯 Domain-Specific Rules</h5>
                            <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                                Different ad strategies for different product categories (clothing vs electronics).
                            </p>
                        </div>
                        <div>
                            <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>💰 Revenue Optimization</h5>
                            <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                                Fine-tune revenue by adjusting bid weights, CTR factors, and user segmentation.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                    marginTop: '30px',
                    textAlign: 'center',
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <a href="/ad-demo" style={{
                        background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        💰 Try Ad Demo
                    </a>
                    
                    <a href="/" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        🏠 Back to Main
                    </a>
                </div>
            </div>
        </div>
    );
}
