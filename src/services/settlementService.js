const { convert } = require('./fxService');
const { routePayment } = require('./routingService');
const { v4: uuidv4 } = require('uuid');

async function processPayment(fromCurrency, toCurrency, amount, senderPhone, recieverPhone) {
    
    const fx = await convert(amount, fromCurrency, toCurrency);

    
    const route = routePayment(fromCurrency, toCurrency, amount);

    const transaction = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        sender: {
            phone: senderPhone,
            currency: fromCurrency,
            amount: amount,
            provider: route.sender 
        },
        receiver: {
            phone: recieverPhone,
            currency: toCurrency,
            amount: fx.converted,
            provider: route.receiver
        },
        exchangeRate: fx.rate,
        corridor: route.corridor,
        status: 'settled' 
    };

    return transaction;
    
}

module.exports = { processPayment };