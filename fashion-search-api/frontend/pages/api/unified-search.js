import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { 
                query, 
                domain, 
                limit, 
                ranking_weights, 
                retrieval_weights,
                ad_integration,
                ad_budget,
                user_segment,
                search_algorithm,
                boost_factors
            } = req.body;
            const sessionId = req.headers['x-session-id'];
            
            const response = await axios.post('http://127.0.0.1:8000/unified/unified-search', {
                query,
                domain,
                limit,
                ranking_weights,
                retrieval_weights,
                ad_integration,
                ad_budget,
                user_segment,
                search_algorithm,
                boost_factors
            }, {
                headers: {
                    'X-Session-ID': sessionId,
                    'Content-Type': 'application/json'
                }
            });
            
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Unified Search API Error:', error.message);
            console.error('Error details:', error.response?.data);
            
            res.status(error.response?.status || 500).json({
                results: [],
                search_metadata: {},
                ranking_breakdown: {},
                ad_breakdown: {},
                algorithm_performance: {},
                error: error.message
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
