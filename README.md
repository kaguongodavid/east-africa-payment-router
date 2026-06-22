# 🌍 East Africa Cross-Border Payment Router

A production-style REST API and web app that routes cross-border payments across East Africa — with **live FX conversion**, **smart provider routing**, **multi-currency wallets**, and **transaction settlement**, backed by a PostgreSQL database.

> Built to simulate the real problem of fragmented mobile money systems across Kenya, Uganda, Tanzania and Rwanda.

## 🚀 Live Demo
🔗 https://east-africa-payment-router.onrender.com

Try it directly in your browser — no setup needed. Convert currencies, route payments, create wallets, send money, and view transaction history all from the UI.

## 💡 Problem It Solves
Sending money across East Africa is fragmented — M-Pesa Kenya, Airtel Uganda, M-Pesa Tanzania, and MTN Rwanda all operate as separate, disconnected systems. This project simulates a unified router that automatically:
- Converts between currencies using **live exchange rates**
- Picks the correct mobile money provider for each country
- Settles the transaction and records it permanently
- Lets users hold balances in multiple currencies via wallets

## ✨ Features
- 💱 **Live FX Conversion** — real-time exchange rates via ExchangeRate API, with caching
- 🗺️ **Smart Payment Routing** — automatically matches currency to mobile money provider
- 💸 **Settlement Engine** — generates a full transaction record with a unique ID
- 👛 **Multi-Currency Wallets** — create wallets, top up, and send between wallets
- 📋 **Transaction History** — every transaction persisted in PostgreSQL and queryable
- 🔐 **API Key Authentication** — protected endpoints, just like real fintech APIs
- ✅ **Input Validation & Error Handling** — rejects invalid currencies, negative amounts, same-currency transfers
- 🖥️ **Interactive Web UI** — test every feature without Postman or curl

## 🔧 API Reference

All `/api/v1/*` routes require an `x-api-key` header.

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/` | Health check |
| GET | `/api/v1/rates?from=KES&to=UGX&amount=1000` | Get live exchange rate |
| POST | `/api/v1/payments` | Send a payment (validated) |
| GET | `/api/v1/payments` | List all transactions |
| GET | `/api/v1/payments/:id` | Get a single transaction |
| POST | `/api/v1/wallets` | Create or fetch a wallet |
| GET | `/api/v1/wallets/:phone` | View wallet balances |
| POST | `/api/v1/wallets/topup` | Top up a wallet balance |
| POST | `/api/v1/wallets/send` | Send money between wallets |

### Example: Send a payment
```bash
curl -X POST https://east-africa-payment-router.onrender.com/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "fromCurrency": "KES",
    "toCurrency": "UGX",
    "amount": 5000,
    "senderPhone": "+254712345678",
    "receiverPhone": "+256712345678"
  }'
```

### Example response
```json
{
  "id": "478635dd-96a0-4514-9096-ba20f0482368",
  "timestamp": "2026-06-11T17:18:55.754Z",
  "sender": { "phone": "+254712345678", "currency": "KES", "amount": 5000, "provider": "M-Pesa Kenya" },
  "receiver": { "phone": "+256712345678", "currency": "UGX", "amount": 145329, "provider": "Airtel Uganda" },
  "exchangeRate": 29.0658,
  "corridor": "KES → UGX",
  "status": "settled"
}
```

## 🗺️ Supported Corridors
- 🇰🇪 KES ↔ 🇺🇬 UGX (Kenya ↔ Uganda)
- 🇰🇪 KES ↔ 🇹🇿 TZS (Kenya ↔ Tanzania)
- 🇰🇪 KES ↔ 🇷🇼 RWF (Kenya ↔ Rwanda)
- Plus all combinations between UGX, TZS, RWF

## 📦 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL (hosted on Neon)
- **FX Rates:** ExchangeRate API (live, cached hourly)
- **Auth:** API key middleware
- **Frontend:** Vanilla HTML/CSS/JS (no framework)
- **Deployment:** Render
- **Dev Tools:** Nodemon

## 🏗️ Architecture
src/

├── controllers/      → Request handlers (paymentController, walletController)

├── routes/           → API route definitions

├── services/

│   ├── fxService.js          → Live currency conversion + caching

│   ├── routingService.js     → Maps currency → mobile money provider

│   └── settlementService.js  → Orchestrates conversion + routing into a transaction

├── models/           → Database queries (wallet.js)

├── middleware/

│   ├── auth.js               → API key authentication

│   └── validate.js           → Input validation

├── config/

│   └── db.js                 → PostgreSQL connection pool

├── public/

│   └── index.html            → Interactive frontend

└── app.js            → Express app entry point 
                                
 ## Run Locally
git clone https://github.com/kaguongodavid/east-africa-payment-router.git
cd east-africa-payment-router
npm install

Create a .env file with:
FX_API_KEY=your_exchangerate_api_key
DATABASE_URL=your_postgresql_connection_string
API_KEYS=your_test_api_key

Then run: npm run dev
Visit http://localhost:3000

## Automated Tests

This project includes a Jest test suite covering the payment routing logic and input validation middleware.

Run with: npm test

Result: 2 test suites passed, 11 tests passed.

## Roadmap
- Rate limiting per API key
- Automated test suite (Jest)
- Webhook notifications for settled transactions
- Admin dashboard for monitoring transaction volume

## Author
David Kaguongo
GitHub: https://github.com/kaguongodavid
