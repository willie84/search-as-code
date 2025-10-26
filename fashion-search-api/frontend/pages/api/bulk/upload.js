import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Authorization header required' });
            }

            const response = await axios.post('http://localhost:8000/bulk/bulk-upload', {}, {
                headers: {
                    'Authorization': authHeader
                }
            });
            
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Bulk Upload Error:', error.message);
            res.status(error.response?.status || 500).json({
                message: error.message,
                error: 'Bulk upload failed'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
