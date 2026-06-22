const { validatePayment } = require('../src/middleware/validate');

function mockReqRes(body) {
    const req = { body };
    const res = {
        statusCode: null,
        jsonData: null,
        status(code) { this.statusCode = code; return this; },
        json(data) { this.jsonData = data; return this; }
    };
    const next = jest.fn();
    return { req, res, next };
}

describe('validatePayment middleware', () => {

    test('passes valid payment to next()', () => {
        const { req, res, next } = mockReqRes({
            fromCurrency: 'KES',
            toCurrency: 'UGX',
            amount: 1000,
            senderPhone: '+254712345678',
            receiverPhone: '+256712345678'
        });
        validatePayment(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.statusCode).toBeNull();
    });

    test('rejects missing fields', () => {
        const { req, res, next } = mockReqRes({ fromCurrency: 'KES' });
        validatePayment(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });

    test('rejects unsupported currency', () => {
        const { req, res, next } = mockReqRes({
            fromCurrency: 'USD',
            toCurrency: 'UGX',
            amount: 1000,
            senderPhone: '+254712345678',
            receiverPhone: '+256712345678'
        });
        validatePayment(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res.jsonData.error).toContain('Unsupported currency');
    });

    test('rejects same from and to currency', () => {
        const { req, res, next } = mockReqRes({
            fromCurrency: 'KES',
            toCurrency: 'KES',
            amount: 1000,
            senderPhone: '+254712345678',
            receiverPhone: '+256712345678'
        });
        validatePayment(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res.jsonData.error).toBe('From and To currencies must be different');
    });

    test('rejects negative amount', () => {
        const { req, res, next } = mockReqRes({
            fromCurrency: 'KES',
            toCurrency: 'UGX',
            amount: -100,
            senderPhone: '+254712345678',
            receiverPhone: '+256712345678'
        });
        validatePayment(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res.jsonData.error).toBe('Amount must be greater than 0');
    });

    test('rejects amount exceeding maximum', () => {
        const { req, res, next } = mockReqRes({
            fromCurrency: 'KES',
            toCurrency: 'UGX',
            amount: 2000000,
            senderPhone: '+254712345678',
            receiverPhone: '+256712345678'
        });
        validatePayment(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res.jsonData.error).toContain('exceeds maximum limit');
    });

});