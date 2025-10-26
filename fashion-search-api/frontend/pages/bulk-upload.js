import { useState, useEffect } from 'react';

export default function BulkUpload() {
  const [loginData, setLoginData] = useState({ password: '' });
  const [token, setToken] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bulkStatus, setBulkStatus] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        setUploadStatus('Login successful!');
        fetchBulkStatus();
      } else {
        setUploadStatus('Login failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      setUploadStatus('Login failed: ' + error.message);
    }
  };

  const fetchBulkStatus = async () => {
    try {
      const response = await fetch('/api/bulk/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBulkStatus(data);
    } catch (error) {
      console.error('Failed to fetch bulk status:', error);
    }
  };

  const startBulkUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('Starting bulk upload of 10,000 products...');

    try {
      const response = await fetch('/api/bulk/bulk-upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.products_uploaded !== undefined) {
        setUploadStatus(`✅ Bulk upload completed! ${data.products_uploaded}/${data.total_products} products uploaded successfully.`);
        setUploadProgress(100);
        fetchBulkStatus(); // Refresh status
      } else {
        setUploadStatus('❌ Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      setUploadStatus('❌ Upload failed: ' + error.message);
    }
    
    setIsUploading(false);
  };

  useEffect(() => {
    if (token) {
      fetchBulkStatus();
    }
  }, [token]);

  if (!token) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
            🔐 Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                Password:
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ password: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Enter admin password"
              />
            </div>
            <button 
              type="submit" 
              style={{ 
                width: '100%',
                padding: '0.75rem', 
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          </form>
          {uploadStatus && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: uploadStatus.includes('✅') ? '#d4edda' : '#f8d7da',
              border: `1px solid ${uploadStatus.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '4px',
              color: uploadStatus.includes('✅') ? '#155724' : '#721c24'
            }}>
              {uploadStatus}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '2rem 0'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '2rem', 
            color: '#2c3e50',
            fontSize: '2rem'
          }}>
            🚀 Bulk Upload Manager
          </h1>
          
          <p style={{ 
            textAlign: 'center', 
            color: '#6c757d', 
            marginBottom: '2rem',
            fontSize: '1.1rem'
          }}>
            Upload 10,000 products to demonstrate Search-as-Code capabilities
          </p>

          {/* Current Status */}
          {bulkStatus && (
            <div style={{ 
              backgroundColor: '#e9ecef', 
              padding: '1rem', 
              borderRadius: '4px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>Current Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>Products in Database:</strong><br />
                  <span style={{ fontSize: '1.5rem', color: '#28a745', fontWeight: 'bold' }}>
                    {bulkStatus.total_products_in_weaviate?.toLocaleString() || 0}
                  </span>
                </div>
                <div>
                  <strong>Status:</strong><br />
                  <span style={{ 
                    color: bulkStatus.status === 'ready' ? '#28a745' : '#ffc107',
                    fontWeight: 'bold'
                  }}>
                    {bulkStatus.status === 'ready' ? '✅ Ready' : '⚠️ Empty'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div style={{ 
            border: '2px dashed #007bff', 
            borderRadius: '8px', 
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f8f9ff'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
              Upload 10,000 Products
            </h3>
            <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
              This will upload the mock storefront data with AI enrichment and vector embeddings.
              <br />
              <strong>Estimated time: 2-3 minutes</strong>
            </p>
            
            <button
              onClick={startBulkUpload}
              disabled={isUploading}
              style={{
                padding: '1rem 2rem',
                backgroundColor: isUploading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isUploading ? '⏳ Uploading...' : '🚀 Start Bulk Upload'}
            </button>

            {/* Progress Bar */}
            {isUploading && (
              <div style={{ marginTop: '2rem' }}>
                <div style={{ 
                  width: '100%', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '20px',
                    backgroundColor: '#007bff',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <p style={{ margin: '0.5rem 0 0 0', color: '#6c757d' }}>
                  {uploadProgress}% Complete
                </p>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {uploadStatus && (
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: uploadStatus.includes('✅') ? '#d4edda' : 
                              uploadStatus.includes('❌') ? '#f8d7da' : '#d1ecf1',
              border: `1px solid ${uploadStatus.includes('✅') ? '#c3e6cb' : 
                                uploadStatus.includes('❌') ? '#f5c6cb' : '#bee5eb'}`,
              borderRadius: '4px',
              color: uploadStatus.includes('✅') ? '#155724' : 
                     uploadStatus.includes('❌') ? '#721c24' : '#0c5460'
            }}>
              {uploadStatus}
            </div>
          )}

          {/* Next Steps */}
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem',
            backgroundColor: '#e7f3ff',
            borderRadius: '4px',
            border: '1px solid #b3d9ff'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#004085' }}>Next Steps:</h4>
            <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#004085' }}>
              <li>Wait for the bulk upload to complete</li>
              <li>Visit the <a href="/store" style={{ color: '#007bff', textDecoration: 'none' }}>E-commerce Store</a> to test search</li>
              <li>Try different domains (Clothing, Groceries, Furniture, Electronics)</li>
              <li>Test search queries and filters</li>
              <li>Observe how Search-as-Code improves relevance</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
