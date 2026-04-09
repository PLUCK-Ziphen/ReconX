import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

from fastapi import FastAPI
import time
import uuid
from datetime import datetime

app = FastAPI()

# In-memory fallback (in case Firebase dies during demo)
transactions = []

# -------------------------------
# 🧠 RECONCILIATION ENGINE
# -------------------------------
def reconcile_transaction(data):
    """
    Simulates real-world reconciliation between
    payment gateway and bank system
    """

    # Simulate processing delay (event-driven feel)
    time.sleep(1)

    gateway_amount = data.get("gateway_amount")
    bank_amount = data.get("bank_amount")

    result = {
        "transaction_id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat(),
        "gateway_amount": gateway_amount,
        "bank_amount": bank_amount,
        "status": "",
        "remarks": ""
    }

    # -------------------------------
    # MATCHING LOGIC
    # -------------------------------
    if bank_amount is None:
        result["status"] = "pending"
        result["remarks"] = "Bank confirmation delayed"

    elif gateway_amount == bank_amount:
        result["status"] = "matched"
        result["remarks"] = "Transaction verified successfully"

    elif abs(gateway_amount - bank_amount) <= 10:
        result["status"] = "minor_mismatch"
        result["remarks"] = "Small difference detected (tolerable)"

    else:
        result["status"] = "mismatch"
        result["remarks"] = "Significant mismatch detected"

    # -------------------------------
    # RISK TAGGING (adds intelligence)
    # -------------------------------
    if gateway_amount > 5000:
        result["risk"] = "high"
    elif gateway_amount > 1000:
        result["risk"] = "medium"
    else:
        result["risk"] = "low"

    return result


# -------------------------------
# 🚀 API: CREATE TRANSACTION
# -------------------------------
@app.post("/create")
def create_transaction(data: dict):
    result = reconcile_transaction(data)

    # Save to Firebase
    db.collection("transactions").add(result)

    return result


# -------------------------------
# 📊 API: GET ALL TRANSACTIONS
# -------------------------------
@app.get("/transactions")
def get_transactions():
    docs = db.collection("transactions").stream()
    
    result = []
    for doc in docs:
        result.append(doc.to_dict())
    
    return result