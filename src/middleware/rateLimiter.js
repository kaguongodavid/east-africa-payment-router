const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests',
        message: 'You have exceeded the rate limit of 20 requests per minute. Please try again later.'
    },
    keyGenerator: (req) => {
        return req.headers['x-api-key'] || ipKeyGenerator(req.ip);
    }
});

module.exports = { apiLimiter };
