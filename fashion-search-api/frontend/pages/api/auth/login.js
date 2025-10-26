import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/login', {
                password: req.body.password
            });
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Auth Error:', error.message);
            res.status(error.response?.status || 500).json({
                message: error.message,
                error: 'Login failed'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
