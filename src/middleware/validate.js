const SUPPORTED_CURRENCIES = ['KES', 'UGX', 'TZS', 'RWF'];

function validatePayment(req, res, next) {
    const { fromCurrency, toCurrency, amount, senderPhone, receiverPhone } = req.body;

    if (!fromCurrency || !toCurrency || !amount || !senderPhone || !receiverPhone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!SUPPORTED_CURRENCIES.includes(fromCurrency)) {
        return res.status(400).json({ error: `Unsupported currency: ${fromCurrency}. Supported: ${SUPPORTED_CURRENCIES.join(', ')}` });
    }

    if (!SUPPORTED_CURRENCIES.includes(toCurrency)) {
        return res.status(400).json({ error: `Unsupported currency: ${toCurrency}. Supported: ${SUPPORTED_CURRENCIES.join(', ')}` });
    }

    if (fromCurrency === toCurrency) {
        return res.status(400).json({ error: 'From and To currencies must be different' });
    }

    if (Number(amount) <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    if (Number(amount) > 1000000) {
        return res.status(400).json({ error: 'Amount exceeds maximum limit of 1,000,000' });
    }

    next();
}

module.exports = { validatePayment };