from fastapi import APIRouter
from datetime import datetime

from api.schemas import URLRequest
from services.url_service import scan_url

from utils.database import scans_collection
from utils.usage import check_usage, increment_usage, get_limit

router = APIRouter(
    prefix="/url",
    tags=["URL Scanner"]
)

print("URL ROUTER LOADED")

@router.post("/scan")
def scan(data: URLRequest):

    print("=== URL SCAN STARTED ===")


    user_id = data.user_id or "guest"
    plan = data.plan or "guest"

    print("USER ID:", user_id)
    print("PLAN:", plan)

    # Check usage limits
    if not check_usage(
        user_id,
        "url",
        plan
    ):
        if plan == "guest":
            return {
                "success": False,
                "message": "Please sign in to continue scanning URLs. Guest users are limited to 1 scan per day."
            }

        return {
            "success": False,
            "message": f"You have reached your daily URL scan limit ({get_limit(plan)} scans/day)."
        }

    print("RUNNING URL MODEL")

    # Run AI scan
    result = scan_url(data.url)
    print("MODEL FINISHED")

    # Increase usage count
    increment_usage(
        user_id,
        "url"
    )
    print("URL COUNT INCREMENTED")


    # Save history only for logged-in users
    if plan != "guest":
        scans_collection.insert_one({
            "type": "url",
            "user_id": user_id,
            "plan": plan,
            "input": data.url,
            "is_malicious": result["is_malicious"],
            "risk_level": result["risk_level"],
            "confidence": result["confidence"],
            "reasons": result["reasons"],
            "created_at": datetime.utcnow()
        })

    return {
        "success": True,
        "user_id": user_id,
        "plan": plan,
        **result
    }