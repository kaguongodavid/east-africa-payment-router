const fetch = require('node-fetch')
require('dotenv').config();

const BASE_URL = `https:v6.exchangerate-api.com/v6/${process.env.FX_API_KEY}` ;

let rateCache = {};
let lastFetched = null;

async function getRates(baseCurrency = 'KES') {
    const now = Date.now() ;
    const cacheAge = lastFetched ? (now - lastFetched) /1000 /60 : 999;

    //Refresh cache every 60 minutes
    if (cacheAge > 60 || !rateCache[baseCurrency]) {
        const response = await fetch(`${BASE_URL}/latest/${baseCurrency}`);
        const data = await response.json();
        rateCache[baseCurrency] = data.conversion_rates;
        lastFetched = now;
    }
return rateCache[baseCurrency];
    
}

async function convert(amount, fromCurrency, toCurrency) {
    const rates = await getRates(fromCurrency);
    const rate = rates[toCurrency];
    if (!rate) throw new Error(`Unsupported currency: ${toCurrency}`)
        return {
             from: fromCurrency,
             to: toCurrency,
             amount,
             converted: parseFloat((amount * rate).toFixed(2)),
             rate  
    }
    
}

module.exports = { getRates, convert };