require('dotenv').config();

const validKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];

function authenticate(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ 
            error: 'Unauthorized', 
            message: 'API key required. Pass it as x-api-key header' 
        });
    }

    if (!validKeys.includes(apiKey)) {
        return res.status(403).json({ 
            error: 'Forbidden', 
            message: 'Invalid API key' 
        });
    }

    next();
}

module.exports = { authenticate };