import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { page = 1, limit = 20, search } = req.query;
            const sessionId = req.headers['x-session-id'];
            
            // Build query parameters
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });
            
            if (search) {
                params.append('search', search);
            }
            
            const response = await axios.get(`http://127.0.0.1:8000/products/products?${params}`, {
                headers: {
                    'X-Session-ID': sessionId
                }
            });
            
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Products API Error:', error.message);
            console.error('Error details:', error.response?.data);
            
            res.status(error.response?.status || 500).json({
                products: [],
                pagination: {
                    page: parseInt(req.query.page) || 1,
                    limit: parseInt(req.query.limit) || 20,
                    total: 0,
                    total_pages: 0,
                    has_next: false,
                    has_prev: false
                },
                search_query: req.query.search || null,
                domain: null,
                error: error.message
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
