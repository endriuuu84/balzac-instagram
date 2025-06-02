// Vercel Serverless Function per statistiche
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.json({
        status: 'active',
        last_update: new Date().toISOString(),
        posts_today: 3,
        engagement_rate: '4.2%',
        followers: 2847,
        avg_likes: 324,
        best_posting_times: ['07:30', '12:30', '19:00']
    });
};