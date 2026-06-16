const { createWallet, getWallet, topUpWallet, deductFromWallet } = require('../models/wallet');
const { processPayment } = require('../services/settlementService');
const db = require('../config/db');

async function createOrGetWallet(req, res) {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });
    const wallet = await createWallet(phone);
    res.status(201).json(wallet);
}

async function getWalletBalance(req, res) {
    const { phone } = req.params;
    const wallet = await getWallet(phone);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.json({
        phone: wallet.phone,
        balances: {
            KES: Number(wallet.kes_balance),
            UGX: Number(wallet.ugx_balance),
            TZS: Number(wallet.tzs_balance),
            RWF: Number(wallet.rwf_balance)
        },
        updated_at: wallet.updated_at
    });
}

async function topUp(req, res) {
    const { phone, currency, amount } = req.body;
    if (!phone || !currency || !amount) return res.status(400).json({ error: 'Phone, currency and amount required' });
    if (Number(amount) <= 0) return res.status(400).json({ error: 'Amount must be greater than 0' });
    const wallet = await topUpWallet(phone, currency, Number(amount));
    res.json({
        message: `Successfully topped up ${Number(amount).toLocaleString()} ${currency}`,
        phone: wallet.phone,
        balances: {
            KES: Number(wallet.kes_balance),
            UGX: Number(wallet.ugx_balance),
            TZS: Number(wallet.tzs_balance),
            RWF: Number(wallet.rwf_balance)
        }
    });
}

async function sendFromWallet(req, res) {
    const { senderPhone, receiverPhone, fromCurrency, toCurrency, amount } = req.body;
    if (!senderPhone || !receiverPhone || !fromCurrency || !toCurrency || !amount) {
        return res.status(400).json({ error: 'All fields required' });
    }

    try {
        // Deduct from sender wallet
        await deductFromWallet(senderPhone, fromCurrency, Number(amount));

        // Process the payment
        const transaction = await processPayment(fromCurrency, toCurrency, Number(amount), senderPhone, receiverPhone);

        // Credit receiver wallet
        await topUpWallet(receiverPhone, toCurrency, transaction.receiver.amount);

        // Save transaction to DB
        await db.query(
            `INSERT INTO transactions (id, timestamp, from_currency, to_currency, amount, converted_amount, exchange_rate, sender_phone, receiver_phone, sender_provider, receiver_provider, corridor, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [
                transaction.id, transaction.timestamp,
                transaction.sender.currency, transaction.receiver.currency,
                transaction.sender.amount, transaction.receiver.amount,
                transaction.exchangeRate, transaction.sender.phone,
                transaction.receiver.phone, transaction.sender.provider,
                transaction.receiver.provider, transaction.corridor, transaction.status
            ]
        );

        res.json({
            message: 'Payment successful',
            transaction,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { createOrGetWallet, getWalletBalance, topUp, sendFromWallet };