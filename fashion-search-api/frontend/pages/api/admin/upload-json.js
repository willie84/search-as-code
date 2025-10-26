import formidable from 'formidable';
import axios from 'axios';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, // Disable Next.js's body parser for formidable
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = formidable();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ message: 'Error parsing form data' });
            }

            try {
                const file = files.file?.[0]; // Access the first file if it's an array
                if (!file) {
                    return res.status(400).json({ message: 'No file uploaded' });
                }

                const adminToken = req.headers.authorization;
                if (!adminToken) {
                    return res.status(401).json({ message: 'Authorization token required' });
                }

                // Read the JSON file
                const fileContent = fs.readFileSync(file.filepath, 'utf8');
                const products = JSON.parse(fileContent);

                // Validate that it's an array
                if (!Array.isArray(products)) {
                    return res.status(400).json({ 
                        message: 'JSON file must contain an array of products' 
                    });
                }

                console.log(`Uploading ${products.length} products to backend...`);

                // Send to backend with longer timeout for large files
                const response = await axios.post('http://127.0.0.1:8000/admin/products/upload-json', products, {
                    headers: {
                        'Authorization': adminToken,
                        'Content-Type': 'application/json'
                    },
                    timeout: 300000 // 5 minute timeout for large files
                });

                console.log('Backend response:', response.data);
                res.status(200).json(response.data);
            } catch (error) {
                console.error('Upload API Error:', error.message);
                console.error('Error details:', error.response?.data);
                
                if (error.response?.status === 422) {
                    res.status(422).json({
                        message: error.response.data?.detail || 'Validation error',
                        errors: error.response.data?.errors || []
                    });
                } else if (error.response?.status === 400 && error.response?.data?.detail) {
                    res.status(400).json({
                        message: error.response.data.detail,
                        errors: error.response.data.errors || []
                    });
                } else {
                    res.status(error.response?.status || 500).json({
                        message: error.message,
                        errors: error.response?.data?.errors || []
                    });
                }
            }
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
