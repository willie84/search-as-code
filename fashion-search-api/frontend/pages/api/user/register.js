import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, password, name, preferences } = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email, password, and name are required' 
                });
            }

            const response = await axios.post('http://127.0.0.1:8000/user/register', {
                email,
                password,
                name,
                preferences
            });

            res.status(200).json(response.data);
        } catch (error) {
            console.error('Registration API Error:', error.message);
            res.status(error.response?.status || 500).json({
                success: false,
                message: error.response?.data?.detail || 'Registration failed'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
