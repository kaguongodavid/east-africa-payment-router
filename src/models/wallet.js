const db = require('../config/db');

async function createWallet(phone) {
    const result = await db.query(
        `INSERT INTO wallets (phone) VALUES ($1) 
         ON CONFLICT (phone) DO UPDATE SET updated_at = NOW()
         RETURNING *`,
        [phone]
    );
    return result.rows[0];
}

async function getWallet(phone) {
    const result = await db.query(
        'SELECT * FROM wallets WHERE phone = $1',
        [phone]
    );
    return result.rows[0];
}

async function topUpWallet(phone, currency, amount) {
    const column = `${currency.toLowerCase()}_balance`;
    const result = await db.query(
        `UPDATE wallets SET ${column} = ${column} + $1, updated_at = NOW()
         WHERE phone = $2 RETURNING *`,
        [amount, phone]
    );
    return result.rows[0];
}

async function deductFromWallet(phone, currency, amount) {
    const column = `${currency.toLowerCase()}_balance`;
    const wallet = await getWallet(phone);
    if (!wallet) throw new Error('Wallet not found');
    if (Number(wallet[column]) < amount) throw new Error('Insufficient balance');
    const result = await db.query(
        `UPDATE wallets SET ${column} = ${column} - $1, updated_at = NOW()
         WHERE phone = $2 RETURNING *`,
        [amount, phone]
    );
    return result.rows[0];
}

module.exports = { createWallet, getWallet, topUpWallet, deductFromWallet };
