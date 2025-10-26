import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Authorization header required' });
            }

            const response = await axios.get('http://localhost:8000/bulk/bulk-status', {
                headers: {
                    'Authorization': authHeader
                }
            });
            
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Bulk Status Error:', error.message);
            res.status(error.response?.status || 500).json({
                message: error.message,
                error: 'Failed to fetch bulk status'
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
