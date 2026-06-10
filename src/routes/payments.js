const express = require('express');
const router = express.Router();
const { sendPayment, getTransaction, getRates } = require('../controllers/paymentController');

router.post('/payments', sendPayment);
router.get('/payments/:id', getTransaction);
router.get('/rates', getRates);

module.exports = router;