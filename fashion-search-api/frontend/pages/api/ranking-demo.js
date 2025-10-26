import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { query, domain, limit, ranking_weights, retrieval_weights } = req.body;
            const sessionId = req.headers['x-session-id'];
            
            const response = await axios.post('http://127.0.0.1:8000/ranking-demo/ranking-demo', {
                query,
                domain,
                limit,
                ranking_weights,
                retrieval_weights
            }, {
                headers: {
                    'X-Session-ID': sessionId,
                    'Content-Type': 'application/json'
                }
            });
            
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Ranking Demo API Error:', error.message);
            console.error('Error details:', error.response?.data);
            
            res.status(error.response?.status || 500).json({
                results: [],
                ranking_config: {},
                domain: req.body.domain || 'clothing',
                query: req.body.query || '',
                total_results: 0,
                error: error.message
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
