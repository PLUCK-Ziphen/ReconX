# 🚀 ReconX

### Serverless Event-Driven Payment Reconciliation Engine

## 📌 Overview

ReconX is a real-time payment reconciliation system that simulates how modern financial systems detect and resolve transaction mismatches.

It processes transaction events, applies reconciliation logic, and updates analytics in real time through a lightweight event-driven architecture.

---

## ⚡ Problem Statement

In real-world financial systems:

* Payment gateways and banks often have inconsistent records
* Manual reconciliation is slow and error-prone
* Delays lead to financial discrepancies and operational overhead

---

## 💡 Solution

ReconX provides:

* Event-driven transaction processing
* Automated reconciliation logic
* Real-time status classification
* Live analytics dashboard

---

## 🧠 How It Works

1. Event Generation
   User triggers a transaction (`POST /create`)

2. Processing Layer
   FastAPI backend processes the event

3. Reconciliation Engine
   Compares gateway and bank data and classifies status:

   * matched
   * minor_mismatch
   * mismatch
   * pending

4. Data Storage
   Stored in Firebase Firestore

5. Live Visualization
   Frontend updates instantly and reflects analytics

---

## 🏗️ Architecture

Event (API Request)
↓
FastAPI Backend (Processing)
↓
Reconciliation Logic
↓
Firebase Firestore (Storage)
↓
React Dashboard (Visualization)

---

## 🧰 Tech Stack

### Backend

* FastAPI (Python)
* Firebase Firestore

### Frontend

* React (Vite)
* Recharts (Analytics)

### Tools

* ngrok (for demo exposure)
* GitHub (version control)

---

## 📊 Features

* Real-time transaction processing
* Event simulation system
* Live analytics dashboard
* Status and risk classification
* Sortable and filterable transaction feed
* Interactive UI with event pipeline visualization

---

## ▶️ Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend/reconx
npm install
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint      | Description                |
| ------ | ------------- | -------------------------- |
| POST   | /create       | Generate transaction event |
| GET    | /transactions | Fetch all transactions     |

---

## 🧪 Demo Flow

1. Open dashboard
2. Click "Generate Transaction Event"
3. Observe pipeline animation
4. View updates in table and charts

---

## 🧠 Key Highlights

* Simulates event-driven architecture without heavy infrastructure
* Demonstrates real-time reconciliation workflows
* Clean integration of backend and frontend

---

## 🚧 Future Improvements

* ML-based anomaly detection
* WebSocket-based real-time updates
* Cloud deployment (true serverless)

---

## 👥 Team

Developed for ComputeX 1.0 Hackathon

---

## 📜 License

For educational and demonstration purposes only
