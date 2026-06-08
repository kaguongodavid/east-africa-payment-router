const express = require('express');
const { convert } = require('./services/fxService');
const app = express();

app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({
        project: "East Africa Cross-Border Payment Router",
        status: "running",
        version: "1.0.0"
    });
});

app.get('/test-fx', async(req, res) => {
    const result = await convert(1000, 'KES', 'UGX');
    res.json(result);
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const { routePayment } = require('./services/routingService');

app.get('/test-routing', (req, res) => {
    const result = routePayment('KES', 'UGX', 1000);
    res.json(result);
});
