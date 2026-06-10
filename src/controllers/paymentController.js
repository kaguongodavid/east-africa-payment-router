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

const { processPayment } = require('../services/settlementService');
const { convert } = require('../services/fxService');
const db = require('../config/db');

async function sendPayment(req, res) {
    const { fromCurrency, toCurrency, amount, senderPhone, receiverPhone } = req.body;

    if (!fromCurrency || !toCurrency || !amount || !senderPhone || !receiverPhone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const transaction = await processPayment(fromCurrency, toCurrency, Number(amount), senderPhone, receiverPhone);

    
    await db.query(
        `INSERT INTO transactions (id, timestamp, from_currency, to_currency, amount, converted_amount, exchange_rate, sender_phone, receiver_phone, sender_provider, receiver_provider, corridor, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
            transaction.id,
            transaction.timestamp,
            transaction.sender.currency,
            transaction.receiver.currency,
            transaction.sender.amount,
            transaction.receiver.amount,
            transaction.exchangeRate,
            transaction.sender.phone,
            transaction.receiver.phone,
            transaction.sender.provider,
            transaction.receiver.provider,
            transaction.corridor,
            transaction.status
        ]
    );

    res.status(201).json(transaction);
}

async function getTransaction(req, res) {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM transactions WHERE id = $1', [id]);
    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(result.rows[0]);
}

async function getAllTransactions(req, res) {
    const result = await db.query('SELECT * FROM transactions ORDER BY timestamp DESC');
    res.json(result.rows);
}

async function getRates(req, res) {
    const { from, to, amount } = req.query;
    const result = await convert(Number(amount) || 1, from, to);
    res.json(result);
}

module.exports = { sendPayment, getTransaction, getAllTransactions, getRates };