import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Authorization token required' 
                });
            }

            const { limit = 20 } = req.query;

            const response = await axios.get(`http://127.0.0.1:8000/user/recommendations?limit=${limit}`, {
                headers: {
                    'Authorization': token
                }
            });

            res.status(200).json(response.data);
        } catch (error) {
            console.error('User Recommendations API Error:', error.message);
            res.status(error.response?.status || 500).json({
                success: false,
                message: error.response?.data?.detail || 'Failed to fetch recommendations'
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
