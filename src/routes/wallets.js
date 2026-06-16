const express = require('express');
const router = express.Router();
const { createOrGetWallet, getWalletBalance, topUp, sendFromWallet } = require('../controllers/walletController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/wallets', createOrGetWallet);
router.get('/wallets/:phone', getWalletBalance);
router.post('/wallets/topup', topUp);
router.post('/wallets/send', sendFromWallet);

module.exports = router;
