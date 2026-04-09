# ReconX – Serverless Event-Driven Payment Reconciliation Engine

A professional fintech dashboard frontend built with React + Vite.

## Setup

```bash
npm install
npm run dev
```

Then open: http://localhost:5173

## Backend Requirements

The app expects your FastAPI/backend server running at:
- `POST http://127.0.0.1:8000/create`  → Creates a new transaction event
- `GET  http://127.0.0.1:8000/transactions` → Returns list of transactions

### Expected Transaction Schema

```json
{
  "transaction_id": "txn_abc123",
  "gateway_amount": 100.00,
  "bank_amount": 100.00,
  "status": "matched",       // matched | minor_mismatch | mismatch | pending
  "risk": "low",             // low | medium | high  (or "risk_level")
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Features

- 🟢 Live transaction feed (auto-polls every 3 seconds)
- ⚡ Event simulation with animated pipeline steps
- 📊 Pie chart: status distribution
- 📈 Bar chart: risk level breakdown
- 🔍 Filterable & sortable transaction table
- 🌊 Animated event flow pipeline indicator
- 🎨 Dark fintech theme (Space Mono + DM Sans)
