import React from 'react';

const ProductGrid = ({ products = [], onProductView, onProductClick, showTitle = true }) => {
    const getCategoryEmoji = (category) => {
        const categoryMap = {
            'Clothing': '👕',
            'Electronics': '📱',
            'Furniture': '🪑',
            'Groceries': '🍎',
            'Other Sports Accessories': '⚽',
            'default': '🛍️'
        };
        return categoryMap[category] || categoryMap['default'];
    };

    const getCategoryColor = (category) => {
        const colorMap = {
            'Clothing': 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
            'Electronics': 'linear-gradient(45deg, #ffecd2, #fcb69f)',
            'Furniture': 'linear-gradient(45deg, #a8edea, #fed6e3)',
            'Groceries': 'linear-gradient(45deg, #4ecdc4, #44a08d)',
            'Other Sports Accessories': 'linear-gradient(45deg, #667eea, #764ba2)',
            'default': 'linear-gradient(45deg, #f093fb, #f5576c)'
        };
        return colorMap[category] || colorMap['default'];
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px',
            padding: '20px 0'
        }}>
            {products && products.length > 0 ? (
                products.map((product, index) => (
                    <div 
                        key={product.id || index} 
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                            // Track product view
                            if (onProductView) {
                                onProductView(product.id || product.product_id);
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                        }}
                        onClick={() => {
                            // Track product click
                            if (onProductClick) {
                                onProductClick(product.id || product.product_id);
                            }
                        }}
                    >
                        {/* Product Image */}
                        <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
                            <img 
                                src={product.image_url} 
                                alt={product.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease'
                                }}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x250/f0f0f0/999999?text=No+Image';
                                }}
                            />
                            
                            {/* Category Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '15px',
                                left: '15px',
                                background: getCategoryColor(product.category),
                                color: 'white',
                                padding: '8px 15px',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}>
                                {getCategoryEmoji(product.category)} {product.category}
                            </div>

                            {/* Price Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                color: '#333',
                                padding: '8px 15px',
                                borderRadius: '20px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}>
                                ${product.price}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div style={{ padding: '25px' }}>
                            <h3 style={{
                                margin: '0 0 10px 0',
                                fontSize: '1.3rem',
                                fontWeight: 'bold',
                                color: '#333',
                                lineHeight: '1.3'
                            }}>
                                {product.title}
                            </h3>
                            
                            <p style={{
                                margin: '0 0 15px 0',
                                color: '#666',
                                fontSize: '0.95rem',
                                lineHeight: '1.5',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {product.description}
                            </p>

                            {/* AI-Enriched Tags */}
                            {(product.color || product.style || product.fabric || product.occasion) && (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    marginBottom: '15px'
                                }}>
                                    {product.color && (
                                        <span style={{
                                            background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '15px',
                                            fontSize: '0.8rem',
                                            fontWeight: '500'
                                        }}>
                                            🎨 {product.color}
                                        </span>
                                    )}
                                    {product.style && (
                                        <span style={{
                                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '15px',
                                            fontSize: '0.8rem',
                                            fontWeight: '500'
                                        }}>
                                            ✨ {product.style}
                                        </span>
                                    )}
                                    {product.fabric && (
                                        <span style={{
                                            background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '15px',
                                            fontSize: '0.8rem',
                                            fontWeight: '500'
                                        }}>
                                            🧵 {product.fabric}
                                        </span>
                                    )}
                                    {product.occasion && (
                                        <span style={{
                                            background: 'linear-gradient(45deg, #ffecd2, #fcb69f)',
                                            color: '#333',
                                            padding: '4px 12px',
                                            borderRadius: '15px',
                                            fontSize: '0.8rem',
                                            fontWeight: '500'
                                        }}>
                                            🎉 {product.occasion}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Additional AI Attributes */}
                            {(product.season || product.target_audience || product.sustainability) && (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    marginTop: '10px'
                                }}>
                                    {product.season && (
                                        <span style={{
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            color: '#667eea',
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '500'
                                        }}>
                                            🌸 {product.season}
                                        </span>
                                    )}
                                    {product.target_audience && (
                                        <span style={{
                                            background: 'rgba(78, 205, 196, 0.1)',
                                            color: '#4ecdc4',
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '500'
                                        }}>
                                            👥 {product.target_audience}
                                        </span>
                                    )}
                                    {product.sustainability && (
                                        <span style={{
                                            background: 'rgba(76, 175, 80, 0.1)',
                                            color: '#4caf50',
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '500'
                                        }}>
                                            🌱 {product.sustainability}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#666'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>No products found</h3>
                    <p style={{ margin: '0', fontSize: '1.1rem' }}>
                        Try a different search term or check your spelling
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;