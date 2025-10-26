import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [image, setImage] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            setQuery('');
            setImage(null);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <form onSubmit={handleSearch} style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                alignItems: 'center'
            }}>
                {/* Main Search Input */}
                <div style={{ 
                    position: 'relative',
                    width: '100%',
                    maxWidth: '500px'
                }}>
                    <input
                        type="text"
                        placeholder="Try: 'red dress', 'gaming laptop', 'organic apples', 'modern sofa'..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '18px 60px 18px 20px',
                            fontSize: '1.1rem',
                            border: '2px solid #e1e5e9',
                            borderRadius: '50px',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            background: 'white'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e1e5e9';
                            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-50%) scale(1.1)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(-50%) scale(1)';
                            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                        }}
                    >
                        🔍
                    </button>
                </div>

                {/* Image Upload Option */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '25px',
                    border: '2px dashed #667eea',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.currentTarget.style.borderColor = '#764ba2';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.borderColor = '#667eea';
                }}>
                    <span style={{ fontSize: '1.2rem' }}>📷</span>
                    <span style={{ color: '#667eea', fontWeight: 'bold' }}>
                        Or upload an image
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        id="image-upload"
                    />
                    <label 
                        htmlFor="image-upload"
                        style={{ 
                            cursor: 'pointer',
                            color: '#667eea',
                            textDecoration: 'underline'
                        }}
                    >
                        Choose File
                    </label>
                </div>

                {/* Quick Search Suggestions */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: '10px'
                }}>
                    {['red dress', 'gaming laptop', 'organic apples', 'modern sofa'].map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                                setQuery(suggestion);
                                onSearch(suggestion);
                            }}
                            style={{
                                padding: '8px 16px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid #e1e5e9',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                color: '#667eea',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: '500'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#667eea';
                                e.target.style.color = 'white';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                                e.target.style.color = '#667eea';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default SearchBar;