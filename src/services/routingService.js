//Determines which payment provider to use based on phone number
const PROVIDERS = {
    KES: { name: 'M-Pesa Kenya', prefix: ['07','01'], country: 'Kenya' },
    UGX: { name: 'Airtel Uganda', prefix: ['07'], country: 'Uganda' },
    TZS: { name: 'M-Pesa Tanzania', prefix: ['07', '06'], country: 'Tanzania' },
    RWF: { name: 'MTN Rwanda', prefix: ['07'], country: 'Rwanda' },
};

function getProvider(currency) {
    const provider = PROVIDERS[currency]
    if (!provider) throw new Error(`No provider for currency: ${currency}`);
    return provider;
}

function routePayment(fromCurrency, toCurrency, amount) {
    const sender = getProvider(fromCurrency);
    const reciever = getProvider(toCurrency);
    return {
        corridor: `${fromCurrency} → ${toCurrency}` ,
        sender: sender.name,
        receiver: reciever.name,
        amount,
        status: 'routed'
        }
}
module.exports = { routePayment, getProvider };