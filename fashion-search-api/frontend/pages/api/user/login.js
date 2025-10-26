import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email and password are required' 
                });
            }

            const response = await axios.post('http://127.0.0.1:8000/user/login', {
                email,
                password
            });

            res.status(200).json(response.data);
        } catch (error) {
            console.error('Login API Error:', error.message);
            res.status(error.response?.status || 500).json({
                success: false,
                message: error.response?.data?.detail || 'Login failed'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
