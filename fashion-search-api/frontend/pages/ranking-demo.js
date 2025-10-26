import { useState, useEffect } from 'react';
import RankingDemo from '../components/RankingDemo';

export default function RankingDemoPage() {
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };
        initializeSession();
    }, []);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    padding: '40px',
                    textAlign: 'center',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
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
                    <p style={{ color: '#666', margin: '0' }}>Initializing ranking demo...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px 0'
        }}>
            {/* Header */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <h1 style={{
                            margin: '0',
                            color: 'white',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                            🎯 Search-as-Code Demo
                        </h1>
                        <p style={{
                            margin: '5px 0 0 0',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '1.1rem'
                        }}>
                            Real-time ranking configuration demonstration
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            🟢 Connected
                        </div>
                        
                        <a href="/" style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                        >
                            ← Back to Main
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <RankingDemo 
                    sessionId={sessionId}
                    onProductView={(productId) => {
                        console.log('Product viewed:', productId);
                    }}
                    onProductClick={(productId) => {
                        console.log('Product clicked:', productId);
                    }}
                />
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
