import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const sessionId = req.headers['x-session-id'];
            if (!sessionId) {
                return res.status(400).json({ message: 'Session ID required' });
            }

            const { limit = 20 } = req.query;

            const response = await axios.get(`http://127.0.0.1:8000/recommendations/recommendations?limit=${limit}`, {
                headers: {
                    'X-Session-ID': sessionId,
                    'Authorization': req.headers.authorization
                }
            });

            res.status(200).json(response.data);
        } catch (error) {
            console.error('Recommendations API Error:', error.message);
            res.status(error.response?.status || 500).json({
                message: error.message,
                error: error.response?.data
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
