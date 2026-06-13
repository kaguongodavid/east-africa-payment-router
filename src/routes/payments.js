const express = require('express');
const router = express.Router();
const { sendPayment, getTransaction, getAllTransactions, getRates } = require('../controllers/paymentController');
const { validatePayment } = require('../middleware/validate');

router.post('/payments', validatePayment, sendPayment);
router.get('/payments', getAllTransactions);
router.get('/payments/:id', getTransaction);
router.get('/rates', getRates);

module.exports = router;