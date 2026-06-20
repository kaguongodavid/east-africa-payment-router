const express = require('express');
const router = express.Router();
const { createOrGetWallet, getWalletBalance, topUp, sendFromWallet } = require('../controllers/walletController');

router.post('/public/wallets', createOrGetWallet);
router.get('/public/wallets/:phone', getWalletBalance);
router.post('/public/wallets/topup', topUp);
router.post('/public/wallets/send', sendFromWallet);

module.exports = router;
