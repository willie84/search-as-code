import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Parse the multipart form data
            const form = formidable({});
            const [fields, files] = await form.parse(req);
            
            const file = files.file?.[0];
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Read the file
            const fileContent = fs.readFileSync(file.filepath);
            
            // Create form data for the backend
            const FormData = require('form-data');
            const formData = new FormData();
            formData.append('file', fileContent, {
                filename: file.originalFilename || 'products.csv',
                contentType: 'text/csv'
            });

            // Get the authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Authorization header required' });
            }

            // Forward to backend
                        const response = await axios.post('http://127.0.0.1:8000/admin/products/upload-csv', formData, {
                headers: {
                    'Authorization': authHeader,
                    ...formData.getHeaders()
                }
            });

            res.status(200).json(response.data);
        } catch (error) {
            console.error('Upload Error:', error.message);
            res.status(error.response?.status || 500).json({
                message: error.message,
                error: 'Upload failed'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
