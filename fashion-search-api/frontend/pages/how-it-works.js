import { useState } from 'react';

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(1);

    const steps = [
        {
            id: 1,
            title: "🔍 Search Algorithm",
            description: "Finds relevant products using different approaches",
            details: [
                "Semantic Search: Uses AI embeddings to understand meaning",
                "Keyword Search: Traditional text matching with BM25",
                "Hybrid Search: Combines both approaches for better results"
            ],
            code: `# Search Algorithm Configuration
search_algorithm: "hybrid"  # semantic, keyword, hybrid
retrieval_weights:
  semantic: 0.6
  keyword: 0.4`
        },
        {
            id: 2,
            title: "⚖️ Ranking Algorithm",
            description: "Scores and ranks results based on multiple factors",
            details: [
                "Relevance Score: How well the product matches the query",
                "Personalization Score: Based on user preferences and behavior",
                "Business Priority Score: Promotes high-value or featured items"
            ],
            code: `# Ranking Configuration
ranking_weights:
  relevance: 0.6
  personalization: 0.3
  business_priority: 0.1

boost_factors:
  "sale": 0.2
  "new": 0.15
  "premium": 0.1`
        },
        {
            id: 3,
            title: "💰 Ad Campaign Integration",
            description: "Inserts sponsored content based on bids and targeting",
            details: [
                "Keyword Targeting: Ads matched to search queries",
                "Bid-Based Ranking: Higher bids get better placement",
                "User Segmentation: Different ads for different user types"
            ],
            code: `# Ad Campaign Configuration
ad_integration: true
ad_budget: 0.3  # 30% of results can be ads
user_segments:
  premium:
    bid_multiplier: 1.5
    max_ad_ratio: 0.35`
        },
        {
            id: 4,
            title: "🔗 Unified Results",
            description: "Combines organic and sponsored results for final output",
            details: [
                "Organic Results: Ranked by search and ranking algorithms",
                "Sponsored Results: Inserted based on ad campaign rules",
                "Transparent Labeling: Clear distinction between organic and ads"
            ],
            code: `# Final Result Structure
{
  "results": [
    {
      "id": "product_123",
      "title": "Women's Dress",
      "score": 0.85,
      "is_sponsored": false,
      "ranking_breakdown": {...}
    },
    {
      "id": "ad_campaign_001",
      "title": "🔥 SUMMER SALE: 50% OFF",
      "is_sponsored": true,
      "bid_amount": 2.50,
      "advertiser": "FashionStore Pro"
    }
  ]
}`
        }
    ];

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
                    🔗 How Search-as-Code Works
                </h1>

                <p style={{ textAlign: 'center', color: '#666', margin: '0 0 30px 0', fontSize: '1.1rem' }}>
                    See how search algorithms, ranking, and ad campaigns work together in a unified system
                </p>

                {/* Step Navigation */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '30px',
                    flexWrap: 'wrap'
                }}>
                    {steps.map((step) => (
                        <button
                            key={step.id}
                            onClick={() => setActiveStep(step.id)}
                            style={{
                                background: activeStep === step.id ? 
                                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                                    'rgba(255, 255, 255, 0.8)',
                                color: activeStep === step.id ? 'white' : '#333',
                                border: '2px solid #667eea',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {step.title}
                        </button>
                    ))}
                </div>

                {/* Active Step Content */}
                {steps.map((step) => (
                    activeStep === step.id && (
                        <div key={step.id} style={{
                            background: '#f8f9fa',
                            borderRadius: '15px',
                            padding: '30px',
                            border: '2px solid #e9ecef'
                        }}>
                            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
                                {step.title}
                            </h2>
                            
                            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '1.1rem' }}>
                                {step.description}
                            </p>
                            
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Key Features:</h4>
                                <ul style={{ margin: '0', paddingLeft: '20px', color: '#666' }}>
                                    {step.details.map((detail, index) => (
                                        <li key={index} style={{ marginBottom: '5px' }}>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Configuration Example:</h4>
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
                                    {step.code}
                                </pre>
                            </div>
                        </div>
                    )
                ))}

                {/* Flow Diagram */}
                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: '#e8f5e8',
                    borderRadius: '15px',
                    border: '2px solid #28a745'
                }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#28a745', textAlign: 'center' }}>
                        🔄 Complete Flow
                    </h3>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '15px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            flex: '1',
                            minWidth: '150px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>Search Algorithm</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>Finds relevant products</div>
                        </div>
                        
                        <div style={{ fontSize: '2rem', color: '#28a745' }}>→</div>
                        
                        <div style={{
                            background: 'white',
                            padding: '15px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            flex: '1',
                            minWidth: '150px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚖️</div>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>Ranking Algorithm</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>Scores and ranks results</div>
                        </div>
                        
                        <div style={{ fontSize: '2rem', color: '#28a745' }}>→</div>
                        
                        <div style={{
                            background: 'white',
                            padding: '15px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            flex: '1',
                            minWidth: '150px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>Ad Integration</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>Inserts sponsored content</div>
                        </div>
                        
                        <div style={{ fontSize: '2rem', color: '#28a745' }}>→</div>
                        
                        <div style={{
                            background: 'white',
                            padding: '15px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            flex: '1',
                            minWidth: '150px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔗</div>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>Unified Results</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>Final ranked results</div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: '#e8f4fd',
                    borderRadius: '15px',
                    border: '2px solid #0066cc'
                }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#0066cc' }}>🎯 Benefits of Search-as-Code:</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div>
                            <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>🔧 Configurable</h5>
                            <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                                All search behavior is defined in version-controlled configuration files.
                            </p>
                        </div>
                        <div>
                            <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>🧪 Testable</h5>
                            <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                                Easy A/B testing of different search configurations and ranking algorithms.
                            </p>
                        </div>
                        <div>
                            <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>👥 Collaborative</h5>
                            <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                                Product managers, engineers, and data scientists can all contribute to search configuration.
                            </p>
                        </div>
                        <div>
                            <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>📊 Transparent</h5>
                            <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                                Clear visibility into how search results are generated and ranked.
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
                    <a href="/unified-demo" style={{
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
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
                        🔗 Try Unified Demo
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
