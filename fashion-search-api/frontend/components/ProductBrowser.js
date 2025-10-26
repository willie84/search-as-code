import { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import SearchBar from './SearchBar';

export default function ProductBrowser({ sessionId, onProductView, onProductClick }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchProducts = async (page = 1, search = '') => {
        try {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            });
            
            if (search.trim()) {
                params.append('search', search.trim());
            }
            
            const response = await fetch(`/api/products?${params}`, {
                headers: {
                    'X-Session-ID': sessionId
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            
            const data = await response.json();
            setProducts(data.products || []);
            setPagination(data.pagination || pagination);
            setSearchQuery(data.search_query || '');
            
        } catch (err) {
            setError(err.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId) {
            fetchProducts(currentPage, searchQuery);
        }
    }, [sessionId, currentPage]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
        fetchProducts(1, query);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchProducts(newPage, searchQuery);
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
        fetchProducts(1, '');
    };

    if (!sessionId) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                margin: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ color: '#666', margin: '0 0 20px 0' }}>
                    🔗 Please wait while we connect your session...
                </h3>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            {/* Search Section */}
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
                    🛍️ Browse All Products
                </h2>
                
                <SearchBar onSearch={handleSearch} />
                
                {searchQuery && (
                    <div style={{
                        marginTop: '15px',
                        textAlign: 'center'
                    }}>
                        <span style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            marginRight: '10px'
                        }}>
                            🔍 Searching: "{searchQuery}"
                        </span>
                        <button
                            onClick={handleClearSearch}
                            style={{
                                background: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            ✕ Clear
                        </button>
                    </div>
                )}
            </div>

            {/* Results Summary */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
                {loading ? (
                    <div style={{ color: '#666' }}>
                        <div style={{
                            display: 'inline-block',
                            width: '20px',
                            height: '20px',
                            border: '3px solid #f3f3f3',
                            borderTop: '3px solid #667eea',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginRight: '10px'
                        }}></div>
                        Loading products...
                    </div>
                ) : error ? (
                    <div style={{ color: '#ff6b6b' }}>
                        ❌ Error: {error}
                    </div>
                ) : (
                    <div style={{ color: '#333' }}>
                        <strong>
                            {searchQuery ? 
                                `Found ${pagination.total} products for "${searchQuery}"` :
                                `Showing ${pagination.total} products`
                            }
                        </strong>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                            Page {pagination.page} of {pagination.total_pages}
                        </div>
                    </div>
                )}
            </div>

            {/* Products Grid */}
            <ProductGrid 
                products={products} 
                onProductView={onProductView}
                onProductClick={onProductClick}
            />

            {/* Pagination Controls */}
            {!loading && !error && pagination.total_pages > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '30px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '15px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.has_prev}
                        style={{
                            background: pagination.has_prev ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            cursor: pagination.has_prev ? 'pointer' : 'not-allowed',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        ← Previous
                    </button>
                    
                    <div style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'center'
                    }}>
                        {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(
                                pagination.total_pages - 4,
                                currentPage - 2
                            )) + i;
                            
                            if (pageNum > pagination.total_pages) return null;
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    style={{
                                        background: pageNum === currentPage ? 
                                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                                            'rgba(255, 255, 255, 0.8)',
                                        color: pageNum === currentPage ? 'white' : '#333',
                                        border: '2px solid #667eea',
                                        padding: '8px 12px',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: pageNum === currentPage ? 'bold' : 'normal',
                                        minWidth: '40px'
                                    }}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.has_next}
                        style={{
                            background: pagination.has_next ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            cursor: pagination.has_next ? 'pointer' : 'not-allowed',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Next →
                    </button>
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
