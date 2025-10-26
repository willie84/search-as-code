import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const sessionId = req.headers['x-session-id'];
            if (!sessionId) {
                return res.status(400).json({ message: 'Session ID required' });
            }

            const { action, productId } = req.body;
            if (!action || !productId) {
                return res.status(400).json({ message: 'Action and productId required' });
            }

            const endpoint = action === 'view' ? 'track/view' : 'track/click';
            
            const response = await axios.post(`http://127.0.0.1:8000/recommendations/${endpoint}`, {
                product_id: productId
            }, {
                headers: {
                    'X-Session-ID': sessionId,
                    'Authorization': req.headers.authorization,
                    'Content-Type': 'application/json'
                }
            });

            res.status(200).json(response.data);
        } catch (error) {
            console.error('Tracking API Error:', error.message);
            res.status(error.response?.status || 500).json({
                message: error.message,
                error: error.response?.data
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
