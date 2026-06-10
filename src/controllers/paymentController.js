const { processPayment } = require('../services/settlementService');
const { convert } = require('../services/fxService');

const transactions = {}; // in-memory store

async function sendPayment(req, res) {
    const { fromCurrency, toCurrency, amount, senderPhone, receiverPhone } = req.body;

    if (!fromCurrency || !toCurrency || !amount || !senderPhone || !receiverPhone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const transaction = await processPayment(fromCurrency, toCurrency, Number(amount), senderPhone, receiverPhone);
    transactions[transaction.id] = transaction;
    res.status(201).json(transaction);
}

async function getTransaction(req, res) {
    const { id } = req.params;
    const transaction = transactions[id];
    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
}

async function getRates(req, res) {
    const { from, to, amount } = req.query;
    const result = await convert(Number(amount) || 1, from, to);
    res.json(result);
}

module.exports = { sendPayment, getTransaction, getRates };