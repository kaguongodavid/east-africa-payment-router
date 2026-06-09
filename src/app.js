const express = require('express');
const { convert } = require('./services/fxService');
const app = express();

app.use(express.json());
app.use(express.static('src/public')); 

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



const { routePayment } = require('./services/routingService');

app.get('/test-routing', (req, res) => {
    const result = routePayment('KES', 'UGX', 1000);
    res.json(result);
});


const { processPayment } = require('./services/settlementService');

app.post('/test-settlement', async (req, res) => {
    const result = await processPayment('KES', 'UGX', 1000, '+25412345678', '+256712345678');
    res.json(result);
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server runnig on port ${PORT}`);
});