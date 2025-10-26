import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { query, domain, limit, ad_integration, ad_budget, user_segment } = req.body;
            const sessionId = req.headers['x-session-id'];
            
            const response = await axios.post('http://127.0.0.1:8000/ads/ad-integration', {
                query,
                domain,
                limit,
                ad_integration,
                ad_budget,
                user_segment
            }, {
                headers: {
                    'X-Session-ID': sessionId,
                    'Content-Type': 'application/json'
                }
            });
            
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Ad Campaigns API Error:', error.message);
            console.error('Error details:', error.response?.data);
            
            res.status(error.response?.status || 500).json({
                results: [],
                ad_campaigns: [],
                total_ads: 0,
                total_organic: 0,
                ad_revenue_estimate: 0,
                query: req.body.query || '',
                domain: req.body.domain || 'clothing',
                error: error.message
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
