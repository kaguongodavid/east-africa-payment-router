const express = require('express');
const { convert } = require('./services/fxService');
const paymentRoutes = require('./routes/payments');
const { apiLimiter } = require('./middleware/rateLimiter');
const app = express();

app.use(express.json());
app.use('/api/', apiLimiter);
app.use(express.static('src/public')); 
app.use('/api/v1', paymentRoutes);


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

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server runnig on port ${PORT}`);
});


app.get('/api/convert', async (req, res) => {
    const { amount, from, to } = req.query;
    const result = await convert(Number(amount), from, to);
    res.json(result);
});


app.get('/api/route', (req, res) => {
    const { from, to, amount } = req.query;
    const result = routePayment(from, to, Number(amount));
    res.json(result);
});


app.post('/api/settle', async (req, res) => {
    const { fromCurrency, toCurrency, amount, senderPhone, receiverPhone } = req.body;
    
    if (Number(amount) <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    
    if (fromCurrency === toCurrency) {
        return res.status(400).json({ error: 'From and To currencies must be different' });
    }

    const result = await processPayment(fromCurrency, toCurrency, Number(amount), senderPhone, receiverPhone);
    res.json(result);
});

const walletRoutes = require('./routes/wallets');
app.use('/api/v1', walletRoutes);