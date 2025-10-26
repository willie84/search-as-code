import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const sessionId = req.headers['x-session-id'];
            if (!sessionId) {
                return res.status(401).json({
                    message: 'Session ID required',
                    results: []
                });
            }

            const response = await axios.post('http://127.0.0.1:8000/search/search', {
                query: req.body.query
            }, {
                headers: {
                    'X-Session-ID': sessionId
                }
            });
            res.status(200).json(response.data);
        } catch (error) {
            console.error('API Error:', error.message);
            res.status(error.response?.status || 500).json({
                message: error.message,
                results: []
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}