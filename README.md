# 🌍 East Africa Cross-Border Payment Router

A production-ready REST API that simulates cross-border payment routing across East Africa with **live FX conversion**, **smart provider routing**, and **transaction settlement**.

> Built to solve the real problem of fragmented payment systems across Kenya, Uganda, Tanzania and Rwanda.

## 🚀 Live Demo
Coming soon — deploying to Render

## 💡 Problem It Solves
Sending money across East Africa is fragmented — M-Pesa Kenya, Airtel Uganda, MTN Rwanda all operate separately. This API acts as a unified router that handles currency conversion and provider selection automatically.

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/test-fx` | Live KES → UGX conversion |
| GET | `/test-routing` | Payment provider routing |
| POST | `/test-settlement` | Full transaction simulation |

## 📦 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **FX Rates:** ExchangeRate API (live)
- **ID Generation:** UUID
- **Dev Tools:** Nodemon

## ⚙️ Run Locally
```bash
git clone https://github.com/kaguongodavid/east-africa-payment-router.git
cd east-africa-payment-router
npm install
cp .env.example .env  # Add your FX API key
npm run dev
```

## 🗺️ Supported Corridors
- 🇰🇪 KES → 🇺🇬 UGX (Kenya to Uganda)
- 🇰🇪 KES → 🇹🇿 TZS (Kenya to Tanzania)
- 🇰🇪 KES → 🇷🇼 RWF (Kenya to Rwanda)

## 👨‍💻 Author
**David Kaguongo**
[GitHub](https://github.com/kaguongodavid)