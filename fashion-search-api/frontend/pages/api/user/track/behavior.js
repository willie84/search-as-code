import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Authorization token required' 
                });
            }

            const { behavior_type, data } = req.body;

            if (!behavior_type || !data) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Behavior type and data are required' 
                });
            }

            const response = await axios.post('http://127.0.0.1:8000/user/track/behavior', {
                behavior_type,
                data
            }, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });

            res.status(200).json(response.data);
        } catch (error) {
            console.error('User Behavior Tracking API Error:', error.message);
            res.status(error.response?.status || 500).json({
                success: false,
                message: error.response?.data?.detail || 'Failed to track behavior'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
