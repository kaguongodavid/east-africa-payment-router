const { routePayment, getProvider } = require('../src/services/routingService');

describe('routingService', () => {
    
    test('getProvider returns correct provider for KES', () => {
        const provider = getProvider('KES');
        expect(provider.name).toBe('M-Pesa Kenya');
        expect(provider.country).toBe('Kenya');
    });

    test('getProvider returns correct provider for UGX', () => {
        const provider = getProvider('UGX');
        expect(provider.name).toBe('Airtel Uganda');
    });

    test('getProvider throws error for unsupported currency', () => {
        expect(() => getProvider('USD')).toThrow('No provider for currency: USD');
    });

    test('routePayment returns correct corridor', () => {
        const result = routePayment('KES', 'UGX', 1000);
        expect(result.corridor).toBe('KES → UGX');
        expect(result.sender).toBe('M-Pesa Kenya');
        expect(result.receiver).toBe('Airtel Uganda');
        expect(result.amount).toBe(1000);
        expect(result.status).toBe('routed');
    });

    test('routePayment throws error for unsupported from currency', () => {
        expect(() => routePayment('USD', 'UGX', 1000)).toThrow();
    });

});