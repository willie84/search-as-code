import { useState } from 'react';

export default function Admin() {
  const [loginData, setLoginData] = useState({ password: '' });
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showProducts, setShowProducts] = useState(false);

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
      } else {
        setUploadStatus('Login failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      setUploadStatus('Login failed: ' + error.message);
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadType, setUploadType] = useState('csv');

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !token) {
      setUploadStatus('Please select a file and ensure you are logged in');
      return;
    }

    setUploadStatus('🔄 Uploading... This may take several minutes for large files. Please wait...');

    try {
      let response;
      
      if (uploadType === 'csv') {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        response = await fetch('/api/admin/upload-csv', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
      } else {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        response = await fetch('/api/admin/upload-json', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
      }

      const data = await response.json();
      if (data.products_uploaded !== undefined) {
        setUploadStatus(`✅ Uploaded ${data.products_uploaded} products successfully! Errors: ${data.errors?.length || 0}`);
        setSelectedFile(null); // Reset file input
        document.getElementById('file-input').value = ''; // Clear file input
      } else {
        setUploadStatus('❌ Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      setUploadStatus('❌ Upload failed: ' + error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProducts(data.products || []);
      setShowProducts(true);
    } catch (error) {
      setUploadStatus('❌ Failed to fetch products: ' + error.message);
    }
  };

  if (!token) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ password: e.target.value })}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px' }}>
            Login
          </button>
        </form>
        {uploadStatus && <p style={{ color: 'red' }}>{uploadStatus}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel</h1>
      <p>Welcome, Admin!</p>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Upload Products</h2>
        
        {/* File Type Selection */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginRight: '15px' }}>
            <input
              type="radio"
              name="uploadType"
              value="csv"
              checked={uploadType === 'csv'}
              onChange={(e) => setUploadType(e.target.value)}
              style={{ marginRight: '5px' }}
            />
            CSV Format
          </label>
          <label>
            <input
              type="radio"
              name="uploadType"
              value="json"
              checked={uploadType === 'json'}
              onChange={(e) => setUploadType(e.target.value)}
              style={{ marginRight: '5px' }}
            />
            JSON Format
          </label>
        </div>

        {/* File Upload */}
        <div style={{ marginBottom: '10px' }}>
          <input
            id="file-input"
            type="file"
            accept={uploadType === 'csv' ? '.csv' : '.json'}
            onChange={handleFileSelect}
            style={{ marginBottom: '10px', display: 'block' }}
          />
          <button 
            onClick={handleFileUpload}
            disabled={!selectedFile}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedFile ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedFile ? 'pointer' : 'not-allowed'
            }}
          >
            {selectedFile ? `Upload ${uploadType.toUpperCase()} Products` : 'Select a file first'}
          </button>
        </div>

        {/* Format Information */}
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '4px',
          fontSize: '14px',
          marginTop: '10px'
        }}>
          <strong>Expected {uploadType.toUpperCase()} format:</strong>
          {uploadType === 'csv' ? (
            <div style={{ marginTop: '5px' }}>
              <code>id,title,description,price,image_url,category</code>
              <br />
              <small>Example: 1,"T-Shirt","Comfortable cotton shirt",19.99,"https://example.com/image.jpg","Clothing"</small>
            </div>
          ) : (
            <div style={{ marginTop: '5px' }}>
              <code>[{`{"id": 1, "title": "T-Shirt", "description": "Comfortable cotton shirt", "price": 19.99, "image_url": "https://example.com/image.jpg", "category": "Clothing"}`}]</code>
            </div>
          )}
        </div>
        {uploadStatus && (
          <div style={{
            padding: '10px',
            backgroundColor: uploadStatus.includes('✅') ? '#d4edda' : uploadStatus.includes('❌') ? '#f8d7da' : '#d1ecf1',
            border: `1px solid ${uploadStatus.includes('✅') ? '#c3e6cb' : uploadStatus.includes('❌') ? '#f5c6cb' : '#bee5eb'}`,
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            {uploadStatus}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Product Management</h2>
        <button 
          onClick={fetchProducts}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          View All Products
        </button>
        <button 
          onClick={() => setShowProducts(false)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Hide Products
        </button>
        
        {showProducts && (
          <div style={{ marginTop: '20px' }}>
            <h3>Current Products ({products.length})</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
              {products.map((product, index) => (
                <div key={index} style={{ 
                  padding: '10px', 
                  borderBottom: '1px solid #eee',
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                }}>
                  <strong>{product.title}</strong> - ${product.price}
                  <br />
                  <small style={{ color: '#666' }}>{product.description}</small>
                  <br />
                  <small style={{ color: '#999' }}>ID: {product.product_id || product.id}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2>Available Domains</h2>
        <ul>
          <li>clothing - Fashion and apparel search</li>
          <li>groceries - Food and grocery search</li>
          <li>furniture - Home and office furniture</li>
          <li>electronics - Tech and electronic devices</li>
        </ul>
      </div>
    </div>
  );
}
