from fastapi import APIRouter
from datetime import datetime

from api.schemas import EmailRequest
from services.email_service import scan_email

from utils.database import scans_collection
from utils.usage import check_usage, increment_usage

router = APIRouter(
    prefix="/email",
    tags=["Email"]
)
 
@router.post("/scan")
def scan(data: EmailRequest):
    user_id = data.user_id or "guest"
    plan = data.plan or "guest"
    print("USER ID:", user_id)
    print("PLAN:", plan)
    # Check usage limits
    if not check_usage(user_id, "email", plan):

        if plan == "guest":
            return {
                "success": False,
                "message": "Please sign in to continue scanning emails. Guest users are limited to 1 scan per day."
            }

        return {
            "success": False,
            "message": f"You have reached your daily email scan limit ({get_limit(plan)} scans/day)."
        }

    # Run AI scan
    result = scan_email(data.text)

    # Increase usage count
    increment_usage(user_id, "email")
    print("EMAIL COUNT INCREMENTED")

    # Save scan history
    # Save history only for logged-in users
    if plan != "guest":
        scans_collection.insert_one({
            "type": "email",
            "user_id": user_id,
            "plan": plan,
            "input": data.text,
            "is_spam": result.get("is_spam"),
            "risk_level": result.get("risk_level"),
            "confidence": result.get("confidence"),
            "reasons": result.get("reasons", []),
            "created_at": datetime.utcnow()
        })

    return {
        "success": True,
        "user_id": user_id,
        "plan": plan,
        **result
    }